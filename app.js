const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { Article, Category, Ad, User } = require('./models');
const { Op } = require('sequelize');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'ajn1_secret_key_2026', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Custom middleware to handle layouts and global data
app.use(async (req, res, next) => {
    // Fetch global data like categories for nav
    try {
        const globalCategories = await Category.findAll();
        res.locals.categories = globalCategories;
        res.locals.moment = require('moment'); // You might need to install moment or use native Date
    } catch (err) {
        console.error('Error fetching global data:', err);
        res.locals.categories = [];
    }

    // Save original render
    const originalRender = res.render;

    // Override render
    res.render = function (view, locals = {}, callback) {
        // Handle optional locals
        if (typeof locals === 'function') {
            callback = locals;
            locals = {};
        }

        originalRender.call(this, view, locals, (err, html) => {
            if (err) {
                if (callback) return callback(err);
                return next(err);
            }

            // If layout is disabled or we are rendering a layout/partial/xhr
            if (locals.layout === false || view === 'layout' || view.startsWith('admin/layout') || req.xhr) {
                if (callback) return callback(null, html);
                res.send(html);
                return;
            }

            // Determine layout file
            const layoutView = locals.layout || 'layout';

            // Render layout with the view content
            originalRender.call(this, layoutView, { body: html, ...locals }, (err, layoutHtml) => {
                if (err) {
                    if (callback) return callback(err);
                    return next(err);
                }
                if (callback) return callback(null, layoutHtml);
                res.send(layoutHtml);
            });
        });
    };
    next();
});

// Helpers
// Helpers
app.locals.formatDateDay = (date) => {
    return new Date(date).getDate().toString().padStart(2, '0');
};
app.locals.formatDateMonth = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
};

// Routes
// Home Route
app.get('/', async (req, res) => {
    try {
        // Fetch Main Article (Featured)
        const mainArticle = await Article.findOne({
            where: { featured: true },
            include: [Category],
            order: [['createdAt', 'DESC']]
        });

        const excludeIds = [];
        if (mainArticle) excludeIds.push(mainArticle.id);

        // Fetch P1 Articles (First Fold - 2 articles Next to or below Main)
        const p1Articles = await Article.findAll({
            where: {
                id: { [Op.notIn]: excludeIds }
            },
            include: [Category],
            limit: 2,
            order: [['createdAt', 'DESC']]
        });

        p1Articles.forEach(a => excludeIds.push(a.id));

        // Fetch Featured Articles (Bottom Grid - 3 articles)
        const featuredArticles = await Article.findAll({
            where: {
                id: { [Op.notIn]: excludeIds }
            },
            include: [Category],
            limit: 3,
            order: [['createdAt', 'DESC']]
        });

        featuredArticles.forEach(a => excludeIds.push(a.id));

        // Fetch Latest News (Sidebar - 5 articles)
        const latestNews = await Article.findAll({
            include: [Category],
            limit: 5,
            order: [['createdAt', 'DESC']],
            where: {
                id: { [Op.notIn]: excludeIds }
            },
        });

        // Fetch Ads
        const sidebarAds = await Ad.findAll({ where: { position: 'sidebar' } });
        const headerAd = await Ad.findOne({ where: { position: 'header' } });
        const contentAd = await Ad.findOne({ where: { position: 'content' } });

        res.render('home', {
            mainArticle,
            p1Articles,
            featuredArticles,
            latestNews,
            sidebarAds,
            headerAd,
            contentAd
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Category Route
app.get('/category/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ where: { slug: req.params.slug } });
        if (!category) return res.status(404).send('Category not found');

        const articles = await Article.findAll({
            where: { categoryId: category.id },
            include: [Category],
            order: [['createdAt', 'DESC']]
        });

        // Fetch Sidebar Data
        const sidebarAds = await Ad.findAll({ where: { position: 'sidebar' } });
        const latestNews = await Article.findAll({
            include: [Category],
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.render('category', {
            category,
            articles,
            sidebarAds,
            latestNews
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Article Route
app.get('/article/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({
            where: { slug: req.params.slug },
            include: [Category]
        });

        if (!article) {
            return res.status(404).send('Article not found');
        }

        // Increment views
        article.views += 1;
        await article.save();

        // Fetch Sidebar Data
        const sidebarAds = await Ad.findAll({ where: { position: 'sidebar' } });
        const latestNews = await Article.findAll({
            include: [Category],
            limit: 5,
            order: [['createdAt', 'DESC']],
            where: { id: { [Op.ne]: article.id } }
        });

        res.render('article', {
            article,
            sidebarAds,
            latestNews
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Authentication Middleware
const authenticate = async (req, res, next) => {
    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            role: req.session.userRole
        };
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Authorization Middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.userRole) {
            return res.redirect('/admin/login');
        }

        if (roles.length && !roles.includes(req.session.userRole)) {
            // Unauthorized
            return res.status(403).render('admin/403', { layout: 'admin/layout' });
        }

        next();
    };
};

// Admin Routes

// Login Page
app.get('/admin/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    // Render without layout for login
    res.render('admin/login', { error: null, layout: false });
});

// Post Login
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (user && await user.validPassword(password)) {
            req.session.userId = user.id;
            req.session.userRole = user.role;
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/login', { error: 'Usuário ou senha inválidos', layout: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Multer Configuration
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Helper to create slug
const createSlug = (text) => text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end

// Admin Routes

// ... Login/Logout/Dashboard routes ...

// Dashboard
app.get('/admin/dashboard', authenticate, async (req, res) => {
    try {
        const articleCount = await Article.count();
        const categoryCount = await Category.count();
        const adCount = await Ad.count();
        const totalViews = await Article.sum('views');

        const articles = await Article.findAll({
            include: [Category],
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.render('admin/dashboard', {
            layout: 'admin/layout', // Use admin layout
            path: '/admin/dashboard',
            articleCount,
            categoryCount,
            adCount,
            totalViews: totalViews || 0,
            articles
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Articles List (Accessible by all roles)
app.get('/admin/articles', authenticate, authorize(['admin', 'coordinator', 'writer']), async (req, res) => {
    try {
        const articles = await Article.findAll({
            include: [Category],
            order: [['createdAt', 'DESC']]
        });
        res.render('admin/dashboard', { // Reusing dashboard for list for now, or create separate list view
            layout: 'admin/layout',
            path: '/admin/articles',
            articles,
            articleCount: 0, categoryCount: 0, adCount: 0, totalViews: 0 // Dummy values if reusing dashboard
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// New Article Form
app.get('/admin/articles/new', authenticate, authorize(['admin', 'coordinator', 'writer']), async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/article-form', {
            layout: 'admin/layout',
            path: '/admin/articles',
            article: {},
            categories,
            action: '/admin/articles'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create Article
app.post('/admin/articles', authenticate, authorize(['admin', 'coordinator', 'writer']), upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, categoryId, featured } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : null;

        await Article.create({
            title,
            excerpt,
            content,
            categoryId,
            image,
            featured: featured === 'on',
            slug: createSlug(title) + '-' + Date.now() // Ensure uniqueness
        });

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Article Form
app.get('/admin/articles/:id/edit', authenticate, authorize(['admin', 'coordinator', 'writer']), async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        const categories = await Category.findAll();

        if (!article) return res.status(404).send('Article not found');

        res.render('admin/article-form', {
            layout: 'admin/layout',
            path: '/admin/articles',
            article,
            categories,
            action: `/admin/articles/${article.id}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Article
app.post('/admin/articles/:id', authenticate, authorize(['admin', 'coordinator', 'writer']), upload.single('image'), async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).send('Article not found');

        const { title, excerpt, content, categoryId, featured } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : article.image; // Keep old image if no new one

        await article.update({
            title,
            excerpt,
            content,
            categoryId,
            image,
            featured: featured === 'on',
            slug: createSlug(title) // Update slug or keep old? Usually update if title changes
        });

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Categories List (Coordinator and Admin)
app.get('/admin/categories', authenticate, authorize(['admin', 'coordinator']), async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/categories', {
            layout: 'admin/layout',
            path: '/admin/categories',
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create Category
app.post('/admin/categories', authenticate, authorize(['admin', 'coordinator']), async (req, res) => {
    try {
        const { name } = req.body;
        await Category.create({
            name,
            slug: createSlug(name)
        });
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Category
app.get('/admin/categories/:id/delete', authenticate, authorize(['admin', 'coordinator']), async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Ads List (Coordinator and Admin)
app.get('/admin/ads', authenticate, authorize(['admin', 'coordinator']), async (req, res) => {
    try {
        const ads = await Ad.findAll();
        res.render('admin/ads', {
            layout: 'admin/layout',
            path: '/admin/ads',
            ads
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create Ad
app.post('/admin/ads', authenticate, authorize(['admin', 'coordinator']), upload.single('image'), async (req, res) => {
    try {
        const { title, content, link, position, type, icon, label } = req.body;
        // If type is image, validation relies on file
        const image = req.file ? '/uploads/' + req.file.filename : null;

        await Ad.create({
            title,
            content,
            link,
            position,
            type,
            icon,
            label,
            image
        });
        res.redirect('/admin/ads');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Delete Ad
app.get('/admin/ads/:id/delete', authenticate, authorize(['admin', 'coordinator']), async (req, res) => {
    try {
        await Ad.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/ads');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Users List (Admin only)
app.get('/admin/users', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin/users', {
            layout: 'admin/layout',
            path: '/admin/users',
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create User
app.post('/admin/users', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { username, password, role } = req.body;
        await User.create({
            username,
            password,
            role
        });
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Delete User
app.get('/admin/users/:id/delete', authenticate, authorize(['admin']), async (req, res) => {
    try {
        if (req.params.id == req.session.userId) {
            return res.send('Você não pode excluir a si mesmo.');
        }
        await User.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Redirect /admin to dashboard
app.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
