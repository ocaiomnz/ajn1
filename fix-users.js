const { User } = require('./models');
const bcrypt = require('bcrypt');

async function fixUsers() {
    try {
        console.log('Corrigindo senhas dos usuários...');
        
        // Apagar usuários existentes
        await User.destroy({ where: {} });
        console.log('🗑️ Usuários antigos removidos');
        
        // Criar admin com senha correta (sem hash manual - o modelo faz automaticamente)
        const admin = await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin criado: admin / admin123');
        
        // Criar editor com senha correta (sem hash manual - o modelo faz automaticamente)
        const editor = await User.create({
            username: 'editor',
            password: 'editor123',
            role: 'editor'
        });
        console.log('✅ Editor criado: editor / editor123');
        
        // Testar login
        console.log('\n🧪 Testando login...');
        
        const adminTest = await User.findOne({ where: { username: 'admin' } });
        const adminValid = await bcrypt.compare('admin123', adminTest.password);
        console.log('🔐 Admin login válido:', adminValid);
        
        const editorTest = await User.findOne({ where: { username: 'editor' } });
        const editorValid = await bcrypt.compare('editor123', editorTest.password);
        console.log('🔐 Editor login válido:', editorValid);
        
        console.log('\n🎉 Usuários corrigidos com sucesso!');
        console.log('📱 Acesse: http://localhost:3000/admin/login');
        console.log('👤 Admin: admin / admin123');
        console.log('👤 Editor: editor / editor123');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        process.exit();
    }
}

fixUsers();
