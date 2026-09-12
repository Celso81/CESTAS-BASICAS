// Edite os dados reais aqui. Nunca coloque senhas, tokens ou dados de clientes.
export default {
  mode: 'production', // Publicação e indexação autorizadas por Celso em 12/09/2026.
  brand: 'Cestas Populares',
  domain: 'https://cestaspopulares.com.br',
  productionBranch: 'main',
  whatsapp: '5581997716247', // Confirmado por Celso em 12/09/2026.
  contact: { email: '', phone: '', hours: '' },
  business: { responsible: '', legalName: '', cnpj: '', registrationStatus: 'pending', address: '' },
  privacy: { email: '', contactConfirmed: false, retention: '' },
  delivery: {
    confirmedCities: [],
    // 14 municípios da RMR, conferidos em fonte oficial em 12/09/2026.
    plannedCities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Paulista', 'Abreu e Lima', 'Araçoiaba', 'Cabo de Santo Agostinho', 'Camaragibe', 'Igarassu', 'Ilha de Itamaracá', 'Ipojuca', 'Itapissuma', 'Moreno', 'São Lourenço da Mata'],
    additionalPlannedCities: ['Vitória de Santo Antão'], // Fora da RMR.
    freight: '',
    leadTime: '',
    notes: ''
  },
  payments: {
    methods: [],
    conditions: '',
    installments: { enabled: false, details: '' },
    noCard: { enabled: false, details: '' },
    ownCredit: { enabled: false, details: '' },
    fiado: { enabled: false, details: '' },
    boleto: { enabled: false, details: '' },
    noIncomeProof: { enabled: false, details: '' }
  },
  catalogConfirmed: false,
  terms: { reviewed: false, cancellation: '', exchanges: '' },
  commercialApproved: false
};
