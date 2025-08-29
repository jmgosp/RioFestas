# Correção do Login com Apple no PWA

## Problema Identificado

O login com Apple estava funcionando no site, mas não no aplicativo PWA (convertido pela Natively). O problema ocorria porque:

1. **No site**: O popup funcionava normalmente e o usuário retornava para a mesma página
2. **No aplicativo PWA**: O `signInWithRedirect` estava sendo usado como fallback, mas havia problemas com o redirecionamento de volta para o app

## Soluções Implementadas

### 1. Detecção Inteligente de PWA

```javascript
function isRunningAsPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('source=pwa') ||
    window.location.hostname === 'localhost' && window.location.port === '' ||
    window.location.protocol === 'file:' ||
    // Detectar se está em um WebView ou app nativo
    /Android|iPhone|iPad|iPod/.test(navigator.userAgent) && 
    (window.navigator.userAgent.includes('wv') || // Android WebView
     window.navigator.userAgent.includes('Mobile') && !window.navigator.userAgent.includes('Safari'))
  );
}
```

### 2. Estratégia de Autenticação Adaptativa

- **Para PWA**: Tenta popup primeiro, mesmo em iOS, para evitar problemas de redirect
- **Para site**: Usa a estratégia original (popup em Safari, redirect em outros navegadores)

### 3. Gerenciamento de Estado de Autenticação

```javascript
// Salvar estado atual para retornar após login
const currentState = {
  timestamp: Date.now(),
  source: 'pwa',
  returnUrl: window.location.href
};
localStorage.setItem('apple_auth_state', JSON.stringify(currentState));
```

### 4. Botões de Retry para PWA

- Botões específicos aparecem quando o login falha no PWA
- Permitem tentar novamente sem sair do app
- Aparecem apenas quando necessário (usuário anônimo + PWA)

### 5. Configurações Específicas para PWA

```javascript
if (isRunningAsPWA()) {
  appleProvider.setCustomParameters({
    prompt: 'select_account',
    response_mode: 'fragment',
    state: 'pwa_auth'
  });
}
```

### 6. Verificação de Estado Não Processado

- Detecta quando o usuário retorna de um login com Apple não processado
- Mostra botões de retry automaticamente
- Limpa estados antigos (> 10 minutos)

## Como Funciona Agora

### Fluxo no Site (Navegador)
1. Usuário clica em "Continuar com Apple"
2. Popup da Apple abre
3. Usuário faz login
4. Popup fecha e usuário retorna logado

### Fluxo no PWA (Aplicativo)
1. Usuário clica em "Continuar com Apple"
2. **Tentativa 1**: Popup da Apple (preferido)
3. **Se popup falhar**: Redirect para página da Apple
4. **Após login**: Retorna ao app com estado salvo
5. **Se falhar**: Botão "Tentar Novamente (App)" aparece

## Benefícios da Solução

1. **Melhor Experiência no PWA**: Popup funciona na maioria dos casos
2. **Fallback Robusto**: Redirect funciona quando popup falha
3. **Estado Preservado**: App "lembra" que o usuário estava fazendo login
4. **Botões de Retry**: Usuário pode tentar novamente sem sair do app
5. **Detecção Automática**: Funciona tanto no site quanto no PWA
6. **Limpeza Automática**: Estados antigos são removidos automaticamente

## Arquivos Modificados

- `index.html`: Implementação principal das funções de autenticação
- Adicionados botões de retry nos modais de login e registro
- Implementada lógica de detecção de PWA
- Adicionado gerenciamento de estado de autenticação

## Testes Recomendados

1. **Site (Navegador)**: Verificar se login com Apple continua funcionando
2. **PWA (Natively)**: Testar login com Apple e verificar se retorna ao app
3. **Fallback**: Simular falha do popup para testar redirect
4. **Retry**: Verificar se botões de retry aparecem quando necessário
5. **Estado**: Verificar se estado é preservado durante o processo

## Notas Importantes

- A solução é compatível com iOS e Android
- Funciona tanto em modo standalone quanto em WebView
- Preserva a experiência original no site
- Adiciona funcionalidades específicas para PWA
- Não quebra funcionalidades existentes
