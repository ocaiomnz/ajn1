const express = require('express');
const router = express.Router();
const { Classified, sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

// Configuração do upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/classifieds/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { files: 5 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
});

// Listar classificados
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const where = { status: 'active' };
        
        if (category && category !== 'todos') {
            where.category = category;
        }
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const classifieds = await Classified.findAll({
            where,
            order: [['featured', 'DESC'], ['createdAt', 'DESC']],
            limit: 50
        });

        const categories = await Classified.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
            raw: true
        });

        res.render('classifieds/index', {
            classifieds,
            categories: categories.map(c => c.category),
            currentCategory: category || 'todos',
            search: search || ''
        });
    } catch (error) {
        console.error('Erro ao listar classificados:', error);
        res.status(500).send('Erro ao carregar classificados');
    }
});

// Formulário de novo classificado
router.get('/novo', (req, res) => {
    res.render('classifieds/form', {
        classified: null,
        action: '/classificados',
        method: 'POST'
    });
});

// Criar classificado
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const images = req.files ? req.files.map(file => `/uploads/classifieds/${file.filename}`) : [];
        
        const classified = await Classified.create({
            ...req.body,
            images: images,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        });

        res.redirect('/classificados/' + classified.id);
    } catch (error) {
        console.error('Erro ao criar classificado:', error);
        res.status(500).send('Erro ao criar classificado');
    }
});

// Detalhes do classificado
router.get('/:id', async (req, res) => {
    try {
        const classified = await Classified.findByPk(req.params.id);
        
        if (!classified || classified.status !== 'active') {
            return res.status(404).send('Classificado não encontrado');
        }

        res.render('classifieds/detail', { classified });
    } catch (error) {
        console.error('Erro ao carregar classificado:', error);
        res.status(500).send('Erro ao carregar classificado');
    }
});

module.exports = router;
