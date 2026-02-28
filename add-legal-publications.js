const { LegalPublication } = require('./models');

async function addLegalPublications() {
    try {
        console.log('Adicionando publicações legais de exemplo...');

        const publications = [
            {
                title: 'Edital de Concurso Público - Prefeitura Municipal de Aracaju',
                content: `A Prefeitura Municipal de Aracaju torna pública a abertura das inscrições para o Concurso Público destinado ao provimento de vagas no quadro de pessoal efetivo, nos termos do presente Edital.

As inscrições serão realizadas no período de 01/03/2026 a 31/03/2026, exclusivamente via internet, através do site oficial da prefeitura.

O concurso oferecerá vagas para os seguintes cargos:
- Professor de Educação Básica (100 vagas)
- Agente Administrativo (50 vagas)
- Agente de Saúde (30 vagas)
- Motorista (20 vagas)

A taxa de inscrição varia de R$ 50,00 a R$ 100,00, conforme o cargo escolhido.

As provas serão aplicadas em maio de 2026, em locais a serem divulgados no dia do edital de convocação.`,
                type: 'edital',
                entity: 'Prefeitura Municipal de Aracaju',
                publicationDate: new Date('2026-02-28'),
                validityDate: new Date('2026-03-31'),
                documentNumber: 'EDITAL-001/2026',
                status: 'active',
                contactInfo: 'Secretaria de Administração\nTelefone: (79) 3218-1000\nEmail: concursos@aracaju.se.gov.br\nHorário de atendimento: 8h às 17h'
            },
            {
                title: 'Licitação nº 015/2026 - Contratação de Serviços de Limpeza',
                content: `A Administração do Hospital Regional de Aracaju torna pública a realização de licitação na modalidade Pregão Eletrônico, para contratação de serviços de limpeza e conservação para as dependências do hospital.

O objeto da licitação compreende:
- Limpeza de áreas administrativas
- Limpeza de áreas hospitalares
- Conservação de pisos e paredes
- Tratamento de resíduos

O valor estimado do contrato é de R$ 50.000,00 mensais, com vigência de 12 meses.

A proposta deverá ser apresentada até o dia 15/03/2026, às 14h, através do portal de licitações do governo do estado.`,
                type: 'licitacao',
                entity: 'Hospital Regional de Aracaju',
                publicationDate: new Date('2026-02-25'),
                validityDate: new Date('2026-03-15'),
                documentNumber: 'LIC-015/2026',
                status: 'active',
                contactInfo: 'Setor de Compras\nTelefone: (79) 3218-2000\nEmail: licitacoes@hra.se.gov.br'
            },
            {
                title: 'Aviso de Suspensão de Atendimento - Agência da Caixa',
                content: `A Caixa Econômica Federal informa aos clientes que a agência localizada no Centro de Aracaju estará com atendimento suspenso nos dias 15 e 16 de março de 2026, devido a obras de modernização.

Durante o período, os clientes poderão utilizar as agências mais próximas:
- Agência Atalaia (500m de distância)
- Agência Jardins (800m de distância)

Os serviços digitais permanecerão disponíveis normalmente através do aplicativo Caixa e internet banking.

Pedimos desculpas pelo inconveniente e agradecemos a compreensão.`,
                type: 'aviso',
                entity: 'Caixa Econômica Federal - Agência Centro',
                publicationDate: new Date('2026-02-20'),
                validityDate: new Date('2026-03-16'),
                documentNumber: 'AV-2026-003',
                status: 'active',
                contactInfo: 'Caixa Econômica Federal\nSAC: 0800-726-0101\nOuvidoria: 0800-726-0101'
            },
            {
                title: 'Declaração de Renda - Programa Social Municipal',
                content: `A Secretaria de Desenvolvimento Social do Município de Aracaju declara para os devidos fins que o programa de auxílio alimentação将继续 beneficiando as famílias cadastradas durante o exercício de 2026.

Os beneficiários deverão atualizar seus dados cadastrais até o dia 30 de abril de 2026, apresentando:
- Comprovante de residência atualizado
- Documento de identidade
- CPF de todos os membros da família
- Comprovante de renda (quando aplicável)

A não atualização cadastral implicará na suspensão temporária do benefício.`,
                type: 'declaracao',
                entity: 'Secretaria de Desenvolvimento Social - Aracaju',
                publicationDate: new Date('2026-02-18'),
                validityDate: new Date('2026-04-30'),
                documentNumber: 'DECL-2026-001',
                status: 'active',
                contactInfo: 'Centro de Referência de Assistência Social\nTelefone: (79) 3218-3000\nEndereço: Rua da Lapa, 123 - Centro'
            }
        ];

        for (const pub of publications) {
            await LegalPublication.create(pub);
            console.log(`✅ Publicação criada: ${pub.title.substring(0, 50)}...`);
        }

        console.log('\n🎉 Publicações legais criadas com sucesso!');
        console.log('📊 Total: 4 publicações');
        console.log('🌐 Acesse: http://localhost:3000/publicacao-legal');

    } catch (error) {
        console.error('❌ Erro ao criar publicações:', error);
    } finally {
        process.exit();
    }
}

addLegalPublications();
