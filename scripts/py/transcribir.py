#!/usr/bin/env python3
"""
Transcripcion de audio con Whisper, con backend por plataforma:
  - macOS Apple Silicon con mlx_whisper instalado -> mlx-whisper (Metal).
  - Cualquier otro caso -> faster-whisper (CTranslate2), CUDA si hay, CPU int8 si no.

Salida JSON identica sea cual sea el backend:
  {backend, modelo, duracion, idioma, segmentos: [{inicio, fin, texto}]}

Uso: python transcribir.py --audio x.wav --salida x.json [--modelo large-v3-turbo] [--idioma es] [--backend auto|mlx|faster]
"""
import argparse
import json
import os
import platform
import sys
import time
import wave


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def duracion_wav(ruta: str):
    try:
        with wave.open(ruta, "rb") as w:
            return w.getnframes() / float(w.getframerate())
    except Exception:
        return None


def elegir_backend(preferido: str) -> str:
    if preferido in ("mlx", "faster"):
        return preferido
    if sys.platform == "darwin" and platform.machine() == "arm64":
        try:
            import mlx_whisper  # noqa: F401
            return "mlx"
        except Exception as e:  # pragma: no cover
            log(f"mlx_whisper no disponible ({e}); uso faster-whisper")
    return "faster"


def repo_mlx(modelo: str) -> str:
    if "/" in modelo:
        return modelo
    nombre = modelo if modelo.startswith("whisper-") else f"whisper-{modelo}"
    return f"mlx-community/{nombre}"


def es_degenerado(segmentos: list) -> bool:
    """Detecta el bucle de repeticion tipico de Whisper (la misma frase una y otra vez).

    Con `condition_on_previous_text=True` los modelos turbo entran en bucle y devuelven
    la misma oracion en todos los segmentos. Si pasa, la transcripcion no sirve.
    """
    if len(segmentos) < 6:
        return False
    textos = [s["texto"].strip().lower() for s in segmentos if s["texto"].strip()]
    if not textos:
        return True
    unicos = len(set(textos))
    return unicos / len(textos) < 0.34


def transcribir_mlx(audio: str, modelo: str, idioma: str) -> dict:
    import mlx_whisper

    repo = repo_mlx(modelo)
    # mlx-community publica unos modelos como "whisper-small-mlx" y otros como
    # "whisper-large-v3-turbo": si el primero no existe, probamos con el sufijo.
    candidatos = [repo] if repo.endswith("-mlx") else [repo, repo + "-mlx"]
    ultimo = None
    for i, candidato in enumerate(candidatos):
        try:
            return _transcribir_mlx_repo(audio, candidato, idioma)
        except Exception as e:
            ultimo = e
            if i + 1 < len(candidatos):
                log(f"{candidato} no sirvio ({type(e).__name__}: {e}); pruebo {candidatos[i + 1]}")
    raise ultimo  # type: ignore[misc]


def _transcribir_mlx_repo(audio: str, repo: str, idioma: str) -> dict:
    import mlx_whisper

    log(f"backend=mlx-whisper modelo={repo}")
    # condition_on_previous_text=False: sin esto, large-v3-turbo entra en bucle de repeticion
    # y devuelve la misma frase durante todo el audio (verificado en este proyecto).
    r = mlx_whisper.transcribe(
        audio,
        path_or_hf_repo=repo,
        language=idioma,
        word_timestamps=False,
        verbose=False,
        condition_on_previous_text=False,
    )
    segmentos = [
        {"inicio": round(float(s["start"]), 2), "fin": round(float(s["end"]), 2), "texto": s["text"].strip()}
        for s in r.get("segments", [])
        if s.get("text", "").strip()
    ]
    return {"backend": "mlx-whisper", "modelo": repo, "idioma": r.get("language", idioma), "segmentos": segmentos}


def hay_cuda() -> bool:
    try:
        import ctranslate2

        return ctranslate2.get_cuda_device_count() > 0
    except Exception:
        return False


def transcribir_faster(audio: str, modelo: str, idioma: str) -> dict:
    from faster_whisper import WhisperModel

    if "/" in modelo:
        # faster-whisper acepta repos de HF convertidos a CTranslate2; los de mlx-community no sirven.
        modelo = modelo.split("/")[-1].replace("whisper-", "")
    cuda = hay_cuda()
    device = "cuda" if cuda else "cpu"
    compute = "float16" if cuda else "int8"
    log(f"backend=faster-whisper modelo={modelo} device={device} compute_type={compute}")
    m = WhisperModel(modelo, device=device, compute_type=compute)
    gen, info = m.transcribe(audio, language=idioma, beam_size=5, vad_filter=True)
    segmentos = []
    for s in gen:
        t = s.text.strip()
        if t:
            segmentos.append({"inicio": round(float(s.start), 2), "fin": round(float(s.end), 2), "texto": t})
    return {"backend": "faster-whisper", "modelo": modelo, "idioma": getattr(info, "language", idioma), "segmentos": segmentos}


def main() -> int:
    ap = argparse.ArgumentParser(description="Transcribe audio a JSON con marcas de tiempo")
    ap.add_argument("--audio", required=True)
    ap.add_argument("--salida", required=True)
    ap.add_argument("--modelo", default="large-v3-turbo")
    ap.add_argument("--idioma", default="es")
    ap.add_argument("--backend", default="auto", choices=["auto", "mlx", "faster"])
    args = ap.parse_args()

    if not os.path.isfile(args.audio):
        log(f"no existe el audio: {args.audio}")
        return 2

    backend = elegir_backend(args.backend)
    t0 = time.time()
    try:
        if backend == "mlx":
            try:
                r = transcribir_mlx(args.audio, args.modelo, args.idioma)
                if es_degenerado(r["segmentos"]):
                    log("mlx-whisper devolvio una transcripcion en bucle; reintento con faster-whisper")
                    r = transcribir_faster(args.audio, args.modelo, args.idioma)
            except Exception as e:
                log(f"mlx-whisper fallo ({type(e).__name__}: {e}); reintento con faster-whisper")
                r = transcribir_faster(args.audio, args.modelo, args.idioma)
        else:
            r = transcribir_faster(args.audio, args.modelo, args.idioma)
        if es_degenerado(r["segmentos"]):
            log("AVISO: la transcripcion parece degenerada (frases repetidas); revisar a mano antes de citarla")
    except Exception as e:
        log(f"transcripcion fallo: {type(e).__name__}: {e}")
        return 1

    dur = duracion_wav(args.audio)
    if dur is None:
        dur = r["segmentos"][-1]["fin"] if r["segmentos"] else 0.0
    salida = {
        "backend": r["backend"],
        "modelo": r["modelo"],
        "duracion": round(float(dur), 2),
        "idioma": r["idioma"],
        "segundos_proceso": round(time.time() - t0, 1),
        "segmentos": r["segmentos"],
    }
    os.makedirs(os.path.dirname(os.path.abspath(args.salida)), exist_ok=True)
    with open(args.salida, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, indent=1)
    log(f"listo: {len(salida['segmentos'])} segmentos, {salida['duracion']} s de audio en {salida['segundos_proceso']} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
