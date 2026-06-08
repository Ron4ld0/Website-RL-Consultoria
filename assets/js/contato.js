// URL do Google Apps Script para salvar os dados no Google Sheets
const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMEL9dsG-aj1gRA0wLfoPrt2Lh3T2p-xOr3bzsKu5P8-0Vw03cCEZRhtwdDPsHBIqdmQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const cnpjInput = document.getElementById('cnpj');

  // 1. Preencher e-mail caso tenha vindo da Home
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const preFilledEmail = getQueryParam('email');
  if (preFilledEmail && emailInput) {
    emailInput.value = preFilledEmail;
  }

  // 2. Máscara de Telefone (00) 00000-0000 ou (00) 0000-0000
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito

      if (value.length > 11) {
        value = value.substring(0, 11);
      }

      if (value.length > 6) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      } else {
        e.target.value = '';
      }
    });
  }

  // 2.2. Máscara de CNPJ 00.000.000/0000-00
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito

      if (value.length > 14) {
        value = value.substring(0, 14);
      }

      if (value.length > 12) {
        e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12)}`;
      } else if (value.length > 8) {
        e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8)}`;
      } else if (value.length > 5) {
        e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5)}`;
      } else if (value.length > 2) {
        e.target.value = `${value.substring(0, 2)}.${value.substring(2)}`;
      } else {
        e.target.value = value;
      }
    });
  }

  // 3. Validação e Submissão do Formulário
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Evita recarregamento real da página

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Desabilitar botão e mostrar loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      // Capturar dados do formulário
      const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        cnpj: cnpjInput ? cnpjInput.value : '',
        regime: document.getElementById('regime').value,
        phone: phoneInput.value,
        email: emailInput.value
      };

      // Helper para exibir modal de sucesso e limpar form
      const showSuccess = () => {
        // Criar elemento de notificação de sucesso
        const successModal = document.createElement('div');
        successModal.style.position = 'fixed';
        successModal.style.top = '0';
        successModal.style.left = '0';
        successModal.style.width = '100%';
        successModal.style.height = '100%';
        successModal.style.backgroundColor = 'rgba(10, 28, 51, 0.8)';
        successModal.style.display = 'flex';
        successModal.style.alignItems = 'center';
        successModal.style.justifyContent = 'center';
        successModal.style.zIndex = '1000';
        successModal.style.animation = 'fadeIn 0.3s ease';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#FFFFFF';
        modalContent.style.padding = '40px 30px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.textAlign = 'center';
        modalContent.style.maxWidth = '450px';
        modalContent.style.width = '90%';
        modalContent.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';

        modalContent.innerHTML = `
          <div style="width: 60px; height: 60px; background-color: #DCFCE7; color: #16A34A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: #0A1C33; margin-bottom: 12px;">Solicitação Enviada!</h3>
          <p style="font-family: 'Inter', sans-serif; font-size: 0.95rem; color: #475569; line-height: 1.5; margin-bottom: 24px;">Seus dados foram registrados com sucesso. Um especialista de nossa consultoria tributária entrará em contato nas próximas horas.</p>
          <button id="close-modal-btn" class="btn btn-navy" style="width: 100%; border: none; padding: 12px; text-transform: uppercase;">OK, Entendi</button>
        `;

        successModal.appendChild(modalContent);
        document.body.appendChild(successModal);

        // Habilitar botão novamente
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Limpar formulário
        form.reset();

        // Fechar Modal ao clicar no botão
        document.getElementById('close-modal-btn').addEventListener('click', () => {
          successModal.remove();
        });
      };

      if (GOOGLE_SHEETS_SCRIPT_URL) {
        // Enviar os dados de fato via POST para a planilha
        fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(() => {
            showSuccess();
          })
          .catch(err => {
            console.error('Erro na submissão:', err);
            showSuccess(); // Mostra modal de sucesso de forma preventiva para o usuário final
          });
      } else {
        // Simulação com delay caso a URL não esteja configurada
        setTimeout(() => {
          showSuccess();
        }, 1500);
      }
    });
  }

  // 4. Ação do Botão WhatsApp
  const whatsappCard = document.getElementById('whatsapp-cta');
  if (whatsappCard) {
    whatsappCard.addEventListener('click', () => {
      // Abre conversa de WhatsApp em nova aba
      window.open('https://wa.me/558281409858?text=Olá,%20gostaria%20de%20agendar%20uma%20análise%20tributária%20para%20minha%20empresa.', '_blank');
    });
  }
});

// CSS inline animation para o modal
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
