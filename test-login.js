const { User } = require('./models');
const bcrypt = require('bcrypt');

async function testLogin() {
    try {
        console.log('Testando login...');
        
        // Buscar usuário admin
        const user = await User.findOne({ where: { username: 'admin' } });
        
        if (!user) {
            console.log('❌ Usuário admin não encontrado');
            return;
        }
        
        console.log('✅ Usuário encontrado:', user.username);
        console.log('🔑 Senha hash:', user.password);
        console.log('👤 Role:', user.role);
        
        // Testar senha
        const isValid = await user.validPassword('admin123');
        console.log('🔐 Senha "admin123" válida?', isValid);
        
        // Testar senha incorreta
        const isInvalid = await user.validPassword('wrong');
        console.log('❌ Senha "wrong" válida?', isInvalid);
        
        // Verificar hash manualmente
        const manualCheck = await bcrypt.compare('admin123', user.password);
        console.log('🔍 Verificação manual bcrypt:', manualCheck);
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        process.exit();
    }
}

testLogin();
