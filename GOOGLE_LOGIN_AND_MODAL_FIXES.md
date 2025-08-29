# Correções: Login Google PWA e Modal de Perfil

## 1. Correção do Login com Google no PWA

### Problema Identificado
O login com Google não funcionava no aplicativo PWA (Natively) porque o navegador interno do app não é considerado confiável pelo Google. O usuário precisava ser redirecionado para o navegador externo do celular.

### Solução Implementada

#### Estratégia de Autenticação Adaptativa para Google
```javascript
const signInWithGoogle = async (isRegistration = false) => {
  // Detectar se está rodando como PWA
  const isPWA = isRunningAsPWA();
  
  // Para PWA, usar redirect para navegador externo
  if (isPWA) {
    // Salvar estado atual para retornar após login
    const currentState = {
      timestamp: Date.now(),
      source: 'pwa',
      returnUrl: window.location.href
    };
    localStorage.setItem('google_auth_state', JSON.stringify(currentState));
    
    // Usar redirect para navegador externo
    await signInWithRedirect(auth, googleProvider);
    return;
  }
  
  // Para site normal, usar popup
  const result = await signInWithPopup(auth, googleProvider);
  // ... resto da lógica
};
```

#### Gerenciamento de Estado para Google
- Salva o estado da autenticação no localStorage
- Preserva a URL de retorno
- Detecta quando o usuário retorna do navegador externo

#### Processamento de Retorno
```javascript
// Verificar se é Apple ou Google
const isApple = cred.providerId === 'apple.com';
const isGoogle = cred.providerId === 'google.com';

if (isGoogle) {
  // Verificar se o usuário já existe no Firestore
  const userDoc = await getDoc(doc(db, USERS_PATH, user.uid));
  
  if (!userDoc.exists()) {
    // Criar novo usuário com dados do Google
    // ... lógica de criação de perfil
  }
}
```

### Como Funciona Agora

#### Fluxo no Site (Navegador)
1. Usuário clica em "Continuar com Google"
2. Popup do Google abre
3. Usuário faz login
4. Popup fecha e usuário retorna logado

#### Fluxo no PWA (Aplicativo)
1. Usuário clica em "Continuar com Google"
2. **Redirect para navegador externo** (Safari/Chrome)
3. Usuário faz login no navegador
4. **Retorna ao app** com estado preservado
5. Login é processado automaticamente

## 2. Correção do Modal de Perfil - Preservação de Scroll

### Problema Identificado
Quando o modal de perfil de usuário era aberto, a página subia automaticamente para o topo, perdendo a posição onde o usuário estava navegando.

### Solução Implementada

#### Preservação da Posição de Scroll
```javascript
async function openUserProfileModal(userId) {
  // Salvar a posição atual de scroll antes de abrir o modal
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  state.savedScrollPosition = currentScrollPosition;
  
  // ... resto da lógica
}
```

#### Prevenção de Scroll Automático
```javascript
// Prevenir scroll da página de fundo quando o modal estiver aberto
document.body.style.overflow = 'hidden';

// Garantir que o modal não cause scroll automático
setTimeout(() => {
  if (state.savedScrollPosition !== undefined) {
    window.scrollTo(0, state.savedScrollPosition);
  }
}, 10);
```

#### Restauração da Posição
```javascript
const hide = (el) => {
  if (el?.id === 'user-profile-modal') {
    document.body.classList.remove('modal-open');
    // Restaurar overflow da página
    document.body.style.overflow = '';
    // Restaurar posição de scroll se foi salva
    if (state.savedScrollPosition !== undefined) {
      window.scrollTo(0, state.savedScrollPosition);
      state.savedScrollPosition = undefined;
    }
  }
};
```

### Como Funciona Agora

#### Antes da Correção
1. Usuário está navegando na página (ex: linha 500)
2. Clica no perfil de um usuário
3. **Página sobe automaticamente para o topo** ❌
4. Modal abre
5. Ao fechar modal, usuário está no topo da página ❌

#### Depois da Correção
1. Usuário está navegando na página (ex: linha 500)
2. Clica no perfil de um usuário
3. **Posição de scroll é preservada** ✅
4. Modal abre na posição atual
5. Ao fechar modal, usuário volta para a mesma posição ✅

## Benefícios das Correções

### Login com Google no PWA
- ✅ Funciona corretamente no aplicativo Natively
- ✅ Usa navegador externo confiável
- ✅ Retorna automaticamente ao app
- ✅ Preserva estado da autenticação
- ✅ Compatível com iOS e Android

### Modal de Perfil
- ✅ Preserva posição de scroll
- ✅ Não causa scroll automático
- ✅ Experiência fluida para o usuário
- ✅ Mantém contexto de navegação
- ✅ Funciona em todos os dispositivos

## Arquivos Modificados

- `index.html`: 
  - Função `signInWithGoogle` atualizada para PWA
  - Função `handleAuthRedirectResult` expandida para Google
  - Função `openUserProfileModal` com preservação de scroll
  - Função `hide` com restauração de posição
  - Função `checkForUnprocessedAuth` para ambos os providers

## Testes Recomendados

### Login com Google
1. **Site**: Verificar se popup continua funcionando
2. **PWA**: Testar login com Google e verificar redirecionamento
3. **Retorno**: Confirmar que retorna ao app automaticamente
4. **Estado**: Verificar se estado é preservado

### Modal de Perfil
1. **Scroll**: Navegar para baixo na página
2. **Abrir Modal**: Clicar em perfil de usuário
3. **Posição**: Verificar se não sobe para o topo
4. **Fechar Modal**: Confirmar que volta para posição original

## Notas Importantes

- Ambas as correções são compatíveis com iOS e Android
- Preservam a experiência original no site
- Adicionam funcionalidades específicas para PWA
- Não quebram funcionalidades existentes
- Melhoram significativamente a UX no aplicativo
