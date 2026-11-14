# Olhares — Pesquisa Fotográfica

Site estático do projeto extensionista (pesquisa fotográfica sobre obesidade), pronto para **GitHub Pages** com publicação automática a cada push em `main`.

## Publicar no GitHub

1. Crie um repositório vazio no GitHub (ex.: `pesquisa-fotografica-obesidade`).
2. No terminal, dentro desta pasta:

```bash
git add .
git commit -m "Site da pesquisa fotográfica com deploy no GitHub Pages"
git remote add origin https://github.com/SEU_USUARIO/pesquisa-fotografica-obesidade.git
git push -u origin main
```

3. No GitHub do repositório:
   - **Settings → Pages**
   - Em **Source**, escolha **GitHub Actions**
4. Aguarde o workflow **Deploy GitHub Pages** (aba Actions).
5. A URL fica algo como:  
   `https://SEU_USUARIO.github.io/pesquisa-fotografica-obesidade/`

## Adicionar fotos

1. Coloque os arquivos em `media/fotos/` (JPG/PNG/WebP).
2. Edite `media/manifest.json`:

```json
{
  "arquivo": "minha-foto.jpg",
  "titulo": "Título curto",
  "legenda": "Legenda respeitosa e contextual"
}
```

3. Faça commit e push — o site atualiza sozinho.

## Adicionar vídeos

### YouTube (recomendado)

No `manifest.json`:

```json
{
  "tipo": "youtube",
  "id": "ID_DO_VIDEO",
  "titulo": "Título",
  "legenda": "Descrição"
}
```

O `id` é a parte depois de `v=` na URL do YouTube.

### Arquivo no repositório

Atenção: o GitHub limita ~100 MB por arquivo. Prefira YouTube/Drive para vídeos longos.

```json
{
  "tipo": "arquivo",
  "arquivo": "entrevista.mp4",
  "titulo": "Título",
  "legenda": "Descrição"
}
```

Coloque o MP4 em `media/videos/`.

## Pré-visualizar localmente

Com Python:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

## Estrutura

```
index.html
styles.css
script.js
media/manifest.json
media/fotos/
media/videos/
.github/workflows/deploy.yml
```
