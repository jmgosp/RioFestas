# Splash Screen do RioFestas

## Como configurar a splash screen

A splash screen é a imagem que aparece quando o usuário abre o RioFestas a partir da tela inicial do dispositivo móvel (PWA).

### Passos para configurar:

1. **Substitua o arquivo `splash-screen.jpg`**:
   - Use a imagem que você forneceu (foto de concerto/festa com multidão e luzes)
   - Dimensões recomendadas: **1290x2796px** (iPhone 14 Pro Max)
   - Formato: JPG ou PNG
   - Tamanho máximo: 2MB

2. **Otimizações recomendadas**:
   - A imagem deve ter boa resolução para diferentes tamanhos de tela
   - Evite texto pequeno, pois pode ficar ilegível em telas menores
   - Use cores vibrantes que combinem com a identidade visual do RioFestas
   - A imagem será redimensionada automaticamente para diferentes dispositivos

3. **Dispositivos suportados**:
   - iPhone (todas as versões)
   - Android (Chrome)
   - iPad
   - Desktop (quando instalado como PWA)

### Arquivos configurados:

- ✅ `index.html` - Meta tags para splash screen
- ✅ `sw.js` - Cache da imagem no service worker
- ✅ `manifest.json` - Configuração PWA

### Testando:

1. Adicione o site à tela inicial do seu dispositivo móvel
2. Feche completamente o app
3. Abra novamente - a splash screen deve aparecer

### Notas técnicas:

- A imagem é servida como `/splash-screen.jpg`
- O service worker cacheia a imagem para carregamento offline
- As meta tags `apple-touch-startup-image` controlam a exibição no iOS
- O `manifest.json` controla a exibição no Android
