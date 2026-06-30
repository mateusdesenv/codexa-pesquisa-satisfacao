const WHATSAPP_NUMBER = '5548988512030';
const form = document.querySelector('#satisfaction-form');
const toast = document.querySelector('#toast');
const copyButton = document.querySelector('#copy-response');

const labels = {
  clientName: 'Nome',
  company: 'Empresa / projeto',
  nps: 'Nota de indicação',
  attendance: 'Atendimento',
  communication: 'Comunicação',
  deadline: 'Prazo e organização',
  result: 'Resultado final',
  liked: 'O que mais gostou',
  improvement: 'O que pode melhorar',
  testimonialPermission: 'Autorização de depoimento',
  finalComment: 'Comentário final',
};

function getValue(formData, key) {
  return String(formData.get(key) || '').trim();
}

function buildMessage() {
  const formData = new FormData(form);
  const rows = [
    '*Pesquisa de satisfação - Codexa*',
    '',
    `*${labels.clientName}:* ${getValue(formData, 'clientName') || '-'}`,
    `*${labels.company}:* ${getValue(formData, 'company') || '-'}`,
    `*${labels.nps}:* ${getValue(formData, 'nps') || '-'}/10`,
    `*${labels.attendance}:* ${getValue(formData, 'attendance') || '-'}`,
    `*${labels.communication}:* ${getValue(formData, 'communication') || '-'}`,
    `*${labels.deadline}:* ${getValue(formData, 'deadline') || '-'}`,
    `*${labels.result}:* ${getValue(formData, 'result') || '-'}`,
    '',
    `*${labels.liked}:* ${getValue(formData, 'liked') || '-'}`,
    `*${labels.improvement}:* ${getValue(formData, 'improvement') || '-'}`,
    `*${labels.testimonialPermission}:* ${getValue(formData, 'testimonialPermission') || '-'}`,
    `*${labels.finalComment}:* ${getValue(formData, 'finalComment') || '-'}`,
  ];

  return rows.join('\n');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

function clearErrors() {
  document.querySelectorAll('.is-invalid').forEach((element) => {
    element.classList.remove('is-invalid');
  });
}

function validateForm() {
  clearErrors();

  const invalidElements = [];
  const requiredTextFields = form.querySelectorAll('input[required][type="text"]');

  requiredTextFields.forEach((input) => {
    if (!input.value.trim()) {
      const wrapper = input.closest('.field');
      wrapper.classList.add('is-invalid');
      invalidElements.push(wrapper);
    }
  });

  const requiredGroups = form.querySelectorAll('[data-required-group]');
  requiredGroups.forEach((group) => {
    const groupName = group.dataset.requiredGroup;
    const checked = form.querySelector(`input[name="${groupName}"]:checked`);
    if (!checked) {
      group.classList.add('is-invalid');
      invalidElements.push(group);
    }
  });

  if (invalidElements.length > 0) {
    invalidElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Preencha os campos obrigatórios antes de enviar.');
    return false;
  }

  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  const message = encodeURIComponent(buildMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('WhatsApp aberto com a avaliação preenchida.');
});

copyButton.addEventListener('click', async () => {
  if (!validateForm()) return;

  try {
    await navigator.clipboard.writeText(buildMessage());
    showToast('Respostas copiadas.');
  } catch (error) {
    showToast('Não foi possível copiar automaticamente.');
  }
});

form.addEventListener('input', (event) => {
  const field = event.target.closest('.field, .question-block');
  if (field) field.classList.remove('is-invalid');
});

form.addEventListener('change', (event) => {
  const field = event.target.closest('.field, .question-block');
  if (field) field.classList.remove('is-invalid');
});
