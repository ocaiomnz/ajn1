const express = require('express');
const router = express.Router();
const { LegalPublication } = require('../models');
const { Op } = require('sequelize');

// Listar publicações legais
router.get('/', async (req, res) => {
    try {
        const { type, search, page = 1 } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;
        
        const where = { status: 'active' };
        
        if (type && type !== 'todos') {
            where.type = type;
        }
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } },
                { entity: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: publications } = await LegalPublication.findAndCountAll({
            where,
            order: [['publicationDate', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.render('legal-publications/index', {
            publications,
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            currentType: type || 'todos',
            search: search || ''
        });
    } catch (error) {
        console.error('Erro ao listar publicações legais:', error);
        res.status(500).send('Erro ao carregar publicações');
    }
});

// Detalhes da publicação
router.get('/:id', async (req, res) => {
    try {
        const publication = await LegalPublication.findByPk(req.params.id);
        
        if (!publication || publication.status !== 'active') {
            return res.status(404).send('Publicação não encontrada');
        }

        res.render('legal-publications/detail', { publication });
    } catch (error) {
        console.error('Erro ao carregar publicação:', error);
        res.status(500).send('Erro ao carregar publicação');
    }
});

module.exports = router;
