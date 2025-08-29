# Como Reativar Login Social (Google e Apple)

## Status Atual
Os botões de login com Google e Apple foram **temporariamente ocultados** para resolver problemas de autenticação no PWA.

## Arquivos Modificados

### 1. `index.html` - Botões Ocultos

#### Modal de Login
```html
<!-- Botão Apple (OCULTO TEMPORARIAMENTE) -->
<!-- <button type="button" class="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3 text-[15px] font-semibold text-white hover:bg-black/90 transition-colors" id="btn-apple-login">
  <img src="https://img.icons8.com/m_sharp/512/FFFFFF/mac-os.png" alt="Apple" class="w-5 h-5 shrink-0" width="20" height="20"/>
  Continuar com Apple
</button> -->

<!-- Botão Google (OCULTO TEMPORARIAMENTE) -->
<!-- <button type="button" class="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors" id="btn-google-login">
  <svg class="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuar com Google
</button> -->
```

#### Modal de Registro
```html
<!-- Botão Apple (OCULTO TEMPORARIAMENTE) -->
<!-- <button type="button" class="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3 text-[15px] font-semibold text-white hover:bg-black/90 transition-colors" id="btn-apple-register">
  <img src="https://img.icons8.com/m_sharp/512/FFFFFF/mac-os.png" alt="Apple" class="w-5 h-5 shrink-0" width="20" height="20"/>
  Continuar com Apple
</button> -->

<!-- Botão Google (OCULTO TEMPORARIAMENTE) -->
<!-- <button type="button" class="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors" id="btn-google-register">
  <svg class="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuar com Google
</button> -->
```

### 2. JavaScript - Event Listeners Ocultos

#### Event Listeners do Google
```javascript
// Event listeners para botões do Google (OCULTOS TEMPORARIAMENTE)
// $('#btn-google-login').addEventListener('click', () => signInWithGoogle(false));
// $('#btn-google-register').addEventListener('click', () => signInWithGoogle(true));
```

#### Event Listeners do Apple
```javascript
// Botões Apple (OCULTOS TEMPORARIAMENTE)
// const btnAppleLogin = $('#btn-apple-login');
// if (btnAppleLogin) btnAppleLogin.addEventListener('click', () => signInWithApple(false));
// const btnAppleRegister = $('#btn-apple-register');
// if (btnAppleRegister) btnAppleRegister.addEventListener('click', () => signInWithApple(true));
```

#### Botões de Retry
```javascript
// Botões de retry para PWA (OCULTOS TEMPORARIAMENTE)
// const btnAppleRetry = $('#btn-apple-retry');
// const btnAppleRetryRegister = $('#btn-apple-retry-register');

// if (btnAppleRetry) btnAppleRetry.addEventListener('click', () => retryAppleAuthInPWA());
// if (btnAppleRetryRegister) btnAppleRetryRegister.addEventListener('click', () => retryAppleAuthInPWA());
```

## Como Reativar

### Passo 1: Descomentar os Botões HTML
1. Abra o arquivo `index.html`
2. Procure pelos comentários `<!-- Botão Apple (OCULTO TEMPORARIAMENTE) -->`
3. Remova os comentários `<!--` e `-->` dos botões que deseja reativar

### Passo 2: Descomentar os Event Listeners
1. Procure pelos comentários `// Event listeners para botões do Google (OCULTOS TEMPORARIAMENTE)`
2. Remova as barras `//` do início das linhas dos event listeners

### Passo 3: Descomentar Funções de Suporte
1. Procure pelas funções `updateAppleRetryButtons()` e `retryAppleAuthInPWA()`
2. Remova os comentários das funções e suas chamadas

## Exemplo de Reativação Completa

### Para Reativar Apenas Google:
```html
<!-- Remover comentários apenas do Google -->
<button type="button" class="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors" id="btn-google-login">
  <svg class="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuar com Google
</button>
```

```javascript
// Remover comentários apenas do Google
$('#btn-google-login').addEventListener('click', () => signInWithGoogle(false));
$('#btn-google-register').addEventListener('click', () => signInWithGoogle(true));
```

## Notas Importantes

- ✅ **Código preservado**: Todo o código está comentado, não foi deletado
- ✅ **Funcionalidade mantida**: As funções de autenticação continuam funcionando
- ✅ **Fácil reativação**: Basta remover os comentários
- ✅ **Seletivo**: Pode reativar apenas Google ou apenas Apple
- ✅ **Testável**: Pode testar cada provider individualmente

## Quando Reativar

1. **Problemas resolvidos**: Quando os problemas de autenticação no PWA forem resolvidos
2. **Testes concluídos**: Após testar a funcionalidade em diferentes dispositivos
3. **Configuração correta**: Quando as configurações do Firebase estiverem corretas
4. **Usuários solicitando**: Se os usuários pedirem essas opções de login

## Backup

O código original está preservado nos arquivos de documentação:
- `APPLE_LOGIN_PWA_FIX.md`
- `GOOGLE_LOGIN_AND_MODAL_FIXES.md`
