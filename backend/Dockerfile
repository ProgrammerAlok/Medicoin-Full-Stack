FROM python:3.12

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN mkdir -p /root/.cache/torch/hub/checkpoints

RUN curl -o /root/.cache/torch/hub/checkpoints/vgg19-dcbb9e9d.pth https://download.pytorch.org/models/vgg19-dcbb9e9d.pth

COPY . /app

WORKDIR /app

RUN uv sync --frozen --no-cache

CMD [ "uv", "run", "app.py", "--port", "8000", "--host", "0.0.0.0" ]