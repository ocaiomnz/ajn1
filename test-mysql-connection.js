const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ajn1_user',
    password: 'MdK?r0oeFyrgt95_',
    database: 'ajn1_wp'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erro de conexão MySQL:', err.message);
        console.log('\nSugestões:');
        console.log('1. Verifique se o MySQL está rodando');
        console.log('2. Verifique se o usuário/senha estão corretos');
        console.log('3. Verifique se o banco de dados existe');
        console.log('4. Tente usar root como usuário para testar');
        return;
    }
    
    console.log('✅ Conectado ao MySQL com sucesso!');
    
    connection.query('SHOW DATABASES;', (err, results) => {
        if (err) {
            console.error('Erro ao listar databases:', err);
            return;
        }
        
        console.log('\nBancos disponíveis:');
        results.forEach(row => {
            console.log(`- ${row.Database}`);
        });
        
        connection.end();
    });
});
