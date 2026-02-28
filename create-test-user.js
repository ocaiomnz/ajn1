const { User, Columnist, Category, Article, Classified } = require('./models');
const bcrypt = require('bcrypt');

async function createTestData() {
    try {
        console.log('Verificando dados de teste...');

        // 1. Verificar/criar usuários
        const adminExists = await User.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin'
            });
            console.log('✅ Usuário admin criado: admin / admin123');
        } else {
            console.log('ℹ️ Usuário admin já existe: admin / admin123');
        }

        const editorExists = await User.findOne({ where: { username: 'editor' } });
        if (!editorExists) {
            await User.create({
                username: 'editor',
                password: await bcrypt.hash('editor123', 10),
                role: 'editor'
            });
            console.log('✅ Usuário editor criado: editor / editor123');
        } else {
            console.log('ℹ️ Usuário editor já existe: editor / editor123');
        }

        // 2. Verificar/criar categorias
        const existingCategories = await Category.findAll();
        if (existingCategories.length === 0) {
            await Category.bulkCreate([
                { name: 'Política', slug: 'politica' },
                { name: 'Economia', slug: 'economia' },
                { name: 'Cultura', slug: 'cultura' },
                { name: 'Esportes', slug: 'esportes' },
                { name: 'Tecnologia', slug: 'tecnologia' },
                { name: 'Urbano', slug: 'urbano' },
                { name: 'Polícia', slug: 'policia' },
                { name: 'Mundo', slug: 'mundo' },
                { name: 'Cinema', slug: 'cinema' },
                { name: 'Saúde', slug: 'saude' }
            ]);
            console.log('✅ 10 categorias criadas');
        } else {
            console.log(`ℹ️ ${existingCategories.length} categorias já existem`);
        }

        // 3. Verificar/criar colunistas
        const existingColumnists = await Columnist.findAll();
        if (existingColumnists.length === 0) {
            await Columnist.create({
                name: 'João Silva',
                slug: 'joao-silva',
                bio: 'Jornalista com 20 anos de experiência, especialista em política econômica.',
                email: 'joao@ajn1.com.br',
                category: 'politica',
                socialMedia: {
                    twitter: 'https://twitter.com/joaosilva',
                    facebook: 'https://facebook.com/joaosilva'
                },
                active: true
            });

            await Columnist.create({
                name: 'Maria Santos',
                slug: 'maria-santos',
                bio: 'Cronista cultural, escritora e crítica de arte.',
                email: 'maria@ajn1.com.br',
                category: 'cultura',
                socialMedia: {
                    instagram: 'https://instagram.com/mariasantos',
                    linkedin: 'https://linkedin.com/in/mariasantos'
                },
                active: true
            });
            console.log('✅ 2 colunistas criados');
        } else {
            console.log(`ℹ️ ${existingColumnists.length} colunistas já existem`);
        }

        // 4. Verificar artigos
        const existingArticles = await Article.findAll();
        if (existingArticles.length === 0) {
            const categories = await Category.findAll();
            const columnist = await Columnist.findOne({ where: { slug: 'joao-silva' } });
            
            await Article.create({
                title: 'Governo anuncia novo plano econômico para 2026',
                slug: 'governo-anuncia-novo-plano-economico-para-2026',
                excerpt: 'Ministro da Fazenda apresenta medidas para controlar inflação e estimular crescimento.',
                content: `O ministro da Fazenda anunciou hoje um conjunto de medidas econômicas que devem entrar em vigor a partir do próximo semestre. O plano inclui redução de impostos para pequenas empresas e incentivos fiscais para setores estratégicos.`,
                image: 'https://via.placeholder.com/800x400',
                categoryId: categories.find(c => c.slug === 'economia').id,
                featured: true,
                views: 1250
            });

            if (columnist) {
                await Article.create({
                    title: 'Coluna: Os desafios da educação pós-pandemia',
                    slug: 'coluna-os-desafios-da-educacao-pos-pandemia',
                    excerpt: 'Reflexões sobre o futuro do ensino no Brasil após os anos de isolamento.',
                    content: `A pandemia deixou marcas profundas no sistema educacional brasileiro. Mais de dois anos depois do retorno às aulas presenciais, ainda enfrentamos desafios enormes para recuperar o aprendizado perdido.`,
                    image: 'https://via.placeholder.com/800x400',
                    categoryId: categories.find(c => c.slug === 'politica').id,
                    columnistId: columnist.id,
                    isColumn: true,
                    featured: false,
                    views: 567
                });
            }
            console.log('✅ Artigos de exemplo criados');
        } else {
            console.log(`ℹ️ ${existingArticles.length} artigos já existem`);
        }

        // 5. Verificar classificados
        const existingClassifieds = await Classified.findAll();
        if (existingClassifieds.length === 0) {
            await Classified.create({
                title: 'Apartamento 2 quartos na Atalaia',
                description: 'Excelente apartamento na Atalaia, 2 quartos, 2 vagas, piscina e academia.',
                price: 350000.00,
                category: 'imoveis',
                contactName: 'José Carlos',
                contactPhone: '(79) 99999-8888',
                contactEmail: 'jose@email.com',
                images: ['https://via.placeholder.com/600x400'],
                featured: true,
                status: 'active'
            });
            console.log('✅ Classificado de exemplo criado');
        } else {
            console.log(`ℹ️ ${existingClassifieds.length} classificados já existem`);
        }

        console.log('\n🎉 Dados de teste verificados/criados com sucesso!');
        console.log('\n📱 Login disponíveis:');
        console.log('   Admin: admin / admin123');
        console.log('   Editor: editor / editor123');
        console.log('\n🌐 Acesse: http://localhost:3000');
        console.log('   Painel admin: http://localhost:3000/admin');

    } catch (error) {
        console.error('❌ Erro ao criar dados de teste:', error);
    } finally {
        process.exit();
    }
}

createTestData();
