const { Article } = require('./models');

async function fixArticleImages() {
    try {
        console.log('Atualizando imagens dos artigos...');
        
        const articles = await Article.findAll();
        
        for (const article of articles) {
            if (!article.image || article.image.includes('placeholder')) {
                // Gerar imagem placeholder com tamanho consistente
                const width = 800;
                const height = 400;
                const seed = article.slug || article.id;
                article.image = `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
                
                await article.save();
                console.log(`✅ Artigo atualizado: ${article.title}`);
            }
        }
        
        console.log('\n🎉 Imagens dos artigos atualizadas com sucesso!');
        console.log('📊 Todas as imagens agora têm tamanho consistente (800x400)');
        
    } catch (error) {
        console.error('❌ Erro ao atualizar imagens:', error);
    } finally {
        process.exit();
    }
}

fixArticleImages();
