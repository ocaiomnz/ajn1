const { sequelize } = require('./models');

async function syncDatabase() {
    try {
        console.log('Sincronizando banco de dados...');
        
        // Força a recriação das tabelas (cuidado: isso apagará dados existentes)
        await sequelize.sync({ force: true });
        
        console.log('✅ Banco de dados sincronizado com sucesso!');
        console.log('📊 Tabelas criadas:');
        
        // Listar tabelas
        const tables = await sequelize.getQueryInterface().showAllTables();
        tables.forEach(table => console.log(`   - ${table}`));
        
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

syncDatabase();
