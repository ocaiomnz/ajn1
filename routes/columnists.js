const express = require('express');
const router = express.Router();
const { Columnist, Article } = require('../models');
const multer = require('multer');
const path = require('path');

// Configuração do upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/columnists/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { files: 1 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPEG e PNG são permitidas!'));
        }
    }
});

// Lista de colunistas
router.get('/', async (req, res) => {
    try {
        const columnists = await Columnist.findAll({
            where: { active: true },
            include: [{
                model: Article,
                as: 'articles',
                where: { isColumn: true },
                limit: 3,
                order: [['createdAt', 'DESC']]
            }],
            order: [['name', 'ASC']]
        });

        res.render('columnists/index', { columnists });
    } catch (error) {
        console.error('Erro ao listar colunistas:', error);
        res.status(500).send('Erro ao carregar colunistas');
    }
});

// Perfil do colunista
router.get('/:slug', async (req, res) => {
    try {
        const columnist = await Columnist.findOne({
            where: { 
                slug: req.params.slug,
                active: true 
            },
            include: [{
                model: Article,
                as: 'articles',
                where: { isColumn: true },
                order: [['createdAt', 'DESC']]
            }]
        });

        if (!columnist) {
            return res.status(404).send('Colunista não encontrado');
        }

        res.render('columnists/profile', { columnist });
    } catch (error) {
        console.error('Erro ao carregar colunista:', error);
        res.status(500).send('Erro ao carregar colunista');
    }
});

// Formulário de novo colunista (admin)
router.get('/novo', (req, res) => {
    res.render('columnists/form', {
        columnist: null,
        action: '/colunistas',
        method: 'POST'
    });
});

// Criar colunista (admin)
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const columnistData = {
            ...req.body,
            photo: req.file ? `/uploads/columnists/${req.file.filename}` : null
        };

        const columnist = await Columnist.create(columnistData);
        res.redirect('/colunistas/' + columnist.slug);
    } catch (error) {
        console.error('Erro ao criar colunista:', error);
        res.status(500).send('Erro ao criar colunista');
    }
});

module.exports = router;
