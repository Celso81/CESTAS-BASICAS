// Edite os dados reais aqui. Nunca coloque senhas, tokens ou dados de clientes.
export default {
  mode: 'production', // Publicação e indexação autorizadas por Celso em 12/09/2026.
  brand: 'Cestas Populares',
  domain: 'https://cestaspopulares.com.br',
  productionBranch: 'main',
  whatsapp: '5581991317454', // Mesmo WhatsApp da loja Móveis Populares PE (Celso, 10/11/2026: mesma operação).
  contact: { email: '', phone: '', hours: '' },
  business: { responsible: '', legalName: '', cnpj: '', registrationStatus: 'pending', address: '' },
  privacy: { email: '', contactConfirmed: false, retention: '' },
  delivery: {
    // Mesma operação e mesma entrega da loja de móveis (Celso, 10/11/2026). Frete e prazo por bairro.
    confirmedCities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Paulista', 'Abreu e Lima', 'Araçoiaba', 'Cabo de Santo Agostinho', 'Camaragibe', 'Igarassu', 'Ilha de Itamaracá', 'Ipojuca', 'Itapissuma', 'Moreno', 'São Lourenço da Mata', 'Vitória de Santo Antão'],
    // 14 municípios da RMR, conferidos em fonte oficial em 12/09/2026.
    plannedCities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Paulista', 'Abreu e Lima', 'Araçoiaba', 'Cabo de Santo Agostinho', 'Camaragibe', 'Igarassu', 'Ilha de Itamaracá', 'Ipojuca', 'Itapissuma', 'Moreno', 'São Lourenço da Mata'],
    additionalPlannedCities: ['Vitória de Santo Antão'], // Fora da RMR.
    freight: '',
    leadTime: '',
    notes: ''
  },
  payments: {
    // Confirmado por Celso em 10/11/2026: cesta no crediário sem entrada, igual à loja de móveis.
    methods: ['À vista no Pix', 'Cartão', 'Crediário próprio, sem entrada'],
    conditions: 'Os valores à vista, no cartão e no crediário são informados pelo WhatsApp, junto com a lista de itens. Confira o total antes de fechar.',
    installments: { enabled: true, details: 'O parcelamento é combinado no atendimento, conforme o valor da compra. Peça o valor de cada parcela e o total a prazo por escrito.' },
    noCard: { enabled: true, details: 'O crediário próprio não usa cartão de crédito.' },
    ownCredit: { enabled: true, details: 'Sem entrada. O cadastro é feito em uma visita na sua casa, antes da entrega, com documento com foto e comprovante de endereço. Nome negativado não barra o cadastro, mas não há aprovação automática: a resposta sai depois da visita.' },
    fiado: { enabled: false, details: '' },
    boleto: { enabled: true, details: 'As parcelas do crediário são pagas no carnê, entregue com o contrato junto com a cesta. O vencimento é combinado perto do dia em que você recebe.' },
    noIncomeProof: { enabled: false, details: '' }
  },
  catalogConfirmed: false,
  terms: { reviewed: false, cancellation: '', exchanges: '' },
  commercialApproved: false
};
