const { sequelize: sqliteSequelize, Article, Category, User, Ad } = require('./models');
const mysqlSequelize = require('./config/database-mysql');

async function migrateToMySQL() {
    try {
        console.log('Iniciando migração para MySQL...');
        
        // Conectar ao MySQL
        await mysqlSequelize.authenticate();
        console.log('✅ Conectado ao MySQL');
        
        // Sincronizar modelos no MySQL
        await mysqlSequelize.sync({ force: true });
        console.log('✅ Tabelas criadas no MySQL');
        
        // Importar modelos do MySQL
        const { Article: MySQLArticle, Category: MySQLCategory, User: MySQLUser, Ad: MySQLAd } = require('./models-mysql');
        
        // Migrar Categorias
        const categories = await Category.findAll();
        for (const category of categories) {
            await MySQLCategory.create(category.toJSON());
        }
        console.log(`✅ ${categories.length} categorias migradas`);
        
        // Migrar Usuários
        const users = await User.findAll();
        for (const user of users) {
            await MySQLUser.create(user.toJSON());
        }
        console.log(`✅ ${users.length} usuários migrados`);
        
        // Migrar Artigos
        const articles = await Article.findAll();
        for (const article of articles) {
            await MySQLArticle.create(article.toJSON());
        }
        console.log(`✅ ${articles.length} artigos migrados`);
        
        // Migrar Anúncios
        const ads = await Ad.findAll();
        for (const ad of ads) {
            await MySQLAd.create(ad.toJSON());
        }
        console.log(`✅ ${ads.length} anúncios migrados`);
        
        console.log('🎉 Migração concluída com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na migração:', error);
    } finally {
        await sqliteSequelize.close();
        await mysqlSequelize.close();
    }
}

migrateToMySQL();
