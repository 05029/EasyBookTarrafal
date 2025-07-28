<script>
      /* ==============================================
   SISTEMA DE RESERVAS DE HOTÉIS - TARRAFAL
   ==============================================
   Este script contém todas as funcionalidades interativas do site:
   - Reservas de hotéis
   - Sistema de busca
   - Filtros de acomodações
   - Gerenciamento de conta de usuário
   ============================================== */

// ==============================================
// FUNÇÕES DE RESERVA DE HOTÉIS
// ==============================================

/**
 * Configura os eventos de clique nos botões de reserva
 * Exibe um alerta com informações do hotel quando clicado
 */
function setupBookingButtons() {
  document.querySelectorAll('.btn-book').forEach(button => {
    button.addEventListener('click', function() {
      // Obtém informações do hotel a partir do DOM
      const hotelCard = this.closest('.hotel-card');
      const hotelName = hotelCard.querySelector('h3').textContent;
      const price = hotelCard.querySelector('.hotel-price p').textContent;
      
      // Feedback visual para o usuário
      alert(`Reserva iniciada para:\n\n${hotelName}\n${price}\n\n(Redirecionando para pagamento...)`);
    });
  });
}

// ==============================================
// FUNÇÕES DE BUSCA E FILTROS
// ==============================================

/**
 * Configura o evento de busca principal
 * Coleta valores dos campos e exibe feedback
 */
function setupSearchFunctionality() {
  const searchButton = document.querySelector('.btn-search');
  
  searchButton.addEventListener('click', () => {
    // Coleta valores dos campos de busca
    const destination = document.querySelector('.search-input input').value;
    const dates = document.querySelectorAll('.search-input input[type="date"]');
    const checkIn = dates[0].value;
    const checkOut = dates[1].value;
    const maxPrice = document.getElementById('max-price').value;
    
    // Aplica filtro por preço se existir
    if (maxPrice) {
      filterByPrice(maxPrice);
    }
    
    // Feedback visual da busca
    alert(`Buscando hotéis em ${destination || 'Cabo Verde'} de ${checkIn || '--/--/----'} a ${checkOut || '--/--/----'}...`);
  });
}

/**
 * Filtra hotéis por preço máximo
 * @param {number} maxPrice - Preço máximo para filtro
 */
function filterByPrice(maxPrice) {
  document.querySelectorAll('.hotel-card').forEach(card => {
    const priceText = card.querySelector('.hotel-price p').textContent;
    // Converte o texto do preço para número (remove símbolos e formatação)
    const priceValue = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
    
    // Mostra/oculta cards baseado no preço
    card.style.display = priceValue <= parseFloat(maxPrice) ? 'flex' : 'none';
  });
}

/**
 * Configura os filtros de tipo de acomodação
 */
function setupAccommodationFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const hotelCards = document.querySelectorAll('.hotel-card');
  
  filterButtons.forEach(button => {
    // Evento de clique nos botões de filtro
    button.addEventListener('click', () => {
      // Ativa o botão clicado e desativa os demais
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Aplica o filtro selecionado
      applyAccommodationFilter(button.getAttribute('data-filter'), hotelCards);
    });
    
    // Efeitos visuais de hover
    setupFilterButtonHover(button);
  });
}

/**
 * Aplica o filtro selecionado aos cards de hotel
 * @param {string} filterValue - Valor do filtro a ser aplicado
 * @param {NodeList} hotelCards - Lista de cards de hotel
 */
function applyAccommodationFilter(filterValue, hotelCards) {
  hotelCards.forEach(card => {
    const cardType = card.getAttribute('data-type') || 'hotel';
    card.style.display = (filterValue === 'all' || cardType === filterValue) ? 'flex' : 'none';
  });
}

/**
 * Configura efeitos de hover nos botões de filtro
 * @param {HTMLElement} button - Botão de filtro
 */
function setupFilterButtonHover(button) {
  button.addEventListener('mouseenter', () => {
    if (!button.classList.contains('active')) {
      button.style.transform = 'translateY(-2px)';
    }
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
  });
}

// ==============================================
// EFEITOS VISUAIS
// ==============================================

/**
 * Configura efeitos de hover nos cards de hotel (apenas desktop)
 */
function setupCardHoverEffects() {
  if (window.innerWidth > 768) {
    document.querySelectorAll('.hotel-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'transform 0.2s';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
}

// ==============================================
// GERENCIAMENTO DE CONTA DE USUÁRIO
// ==============================================

/**
 * Configura o sistema de login/conta do usuário
 */
function setupUserAccount() {
  const loginButton = document.querySelector('.btn-login');
  
  loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Verifica se o usuário está logado (simulação)
    const isLoggedIn = localStorage.getItem('userToken') !== null;
    
    // Mostra dropdown ou modal conforme estado
    isLoggedIn ? showAccountDropdown() : showLoginModal();
  });
}

/**
 * Mostra o menu dropdown da conta do usuário
 */
function showAccountDropdown() {
  let dropdown = document.querySelector('.account-dropdown');
  
  // Cria o dropdown se não existir
  if (!dropdown) {
    dropdown = createAccountDropdown();
    document.querySelector('.navbar').appendChild(dropdown);
  }
  
  // Alterna visibilidade
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

/**
 * Cria o elemento dropdown da conta
 * @returns {HTMLElement} Elemento dropdown criado
 */
function createAccountDropdown() {
  const dropdown = document.createElement('div');
  dropdown.className = 'account-dropdown';
  dropdown.innerHTML = `
    <div class="dropdown-content">
      <a href="/perfil"><i class="fas fa-user-circle"></i> Meu Perfil</a>
      <a href="/reservas"><i class="fas fa-calendar-alt"></i> Minhas Reservas</a>
      <a href="/favoritos"><i class="fas fa-heart"></i> Favoritos</a>
      <a href="/configuracoes"><i class="fas fa-cog"></i> Configurações</a>
      <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</a>
    </div>
  `;
  
  // Configura botão de logout
  dropdown.querySelector('#logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('userToken');
    window.location.reload();
  });
  
  return dropdown;
}

/**
 * Mostra o modal de login/cadastro
 */
function showLoginModal() {
  const modal = createLoginModal();
  document.body.appendChild(modal);
  
  // Configura eventos do modal
  setupModalEvents(modal);
}

/**
 * Cria o elemento modal de login
 * @returns {HTMLElement} Elemento modal criado
 */
function createLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'login-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Entrar ou Cadastrar</h2>
      
      <div class="tabs">
        <button class="tab-btn active" data-tab="login">Entrar</button>
        <button class="tab-btn" data-tab="register">Cadastrar</button>
      </div>
      
      <div class="tab-content active" id="login-tab">
        <form id="login-form">
          <input type="email" placeholder="E-mail" required>
          <input type="password" placeholder="Senha" required>
          <button type="submit">Entrar</button>
          <a href="#" class="forgot-password">Esqueceu a senha?</a>
        </form>
      </div>
      
      <div class="tab-content" id="register-tab">
        <form id="register-form">
          <input type="text" placeholder="Nome completo" required>
          <input type="email" placeholder="E-mail" required>
          <input type="password" placeholder="Criar senha" required>
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Configura eventos do modal de login
 * @param {HTMLElement} modal - Elemento modal
 */
function setupModalEvents(modal) {
  // Fechar modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Alternar entre abas
  modal.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
  });
  
  // Simular login (para demonstração)
  modal.querySelector('#login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    localStorage.setItem('userToken', 'simulated_token');
    document.body.removeChild(modal);
    showAccountDropdown();
  });
}

// ==============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==============================================

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  setupBookingButtons();
  setupSearchFunctionality();
  setupAccommodationFilters();
  setupCardHoverEffects();
  setupUserAccount();
});
</script>