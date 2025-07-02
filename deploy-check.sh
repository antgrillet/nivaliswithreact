#!/bin/bash

echo "🚀 Vérification du déploiement Nivalis"
echo "======================================"

# Vérifier que le fichier PDF existe
echo "📄 Vérification du catalogue PDF..."
if [ -f "public/Catalogue sur Mesure Arpin 2022.pdf" ]; then
    echo "✅ PDF trouvé: $(ls -lh 'public/Catalogue sur Mesure Arpin 2022.pdf' | awk '{print $5}')"
else
    echo "❌ PDF manquant!"
fi

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
echo "Permissions du dossier public: $(ls -ld public/)"
echo "Permissions du PDF: $(ls -l 'public/Catalogue sur Mesure Arpin 2022.pdf' 2>/dev/null || echo 'Fichier non trouvé')"

# Vérifier la configuration Next.js
echo "⚙️ Vérification de la configuration..."
if [ -f "next.config.ts" ]; then
    echo "✅ Configuration Next.js trouvée (TypeScript)"
else
    echo "❌ Configuration Next.js manquante!"
fi

# Vérifier les API routes
echo "🔌 Vérification des API routes..."
if [ -f "src/app/api/download/route.ts" ]; then
    echo "✅ API download trouvée"
else
    echo "❌ API download manquante!"
fi

# Vérifier le middleware
echo "🛡️ Vérification du middleware..."
if [ -f "src/middleware.ts" ]; then
    echo "✅ Middleware trouvé"
else
    echo "❌ Middleware manquant!"
fi

# Build et test
echo "🔨 Test de build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    
    echo "🧪 Lancement du serveur de test..."
    echo "Vous pouvez tester les téléchargements sur:"
    echo "- http://localhost:3000/test-download.html"
    echo "- http://localhost:3000/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf"
    
    npm run start &
    SERVER_PID=$!
    
    sleep 5
    
    echo "🔍 Test des endpoints..."
    curl -I "http://localhost:3000/Catalogue%20sur%20Mesure%20Arpin%202022.pdf" || echo "❌ Accès direct PDF échoué"
    curl -I "http://localhost:3000/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf" || echo "❌ API download échouée"
    
    kill $SERVER_PID
else
    echo "❌ Build échoué!"
fi

echo ""
echo "📋 Instructions pour le VPS:"
echo "1. Vérifiez que tous les fichiers sont uploadés"
echo "2. Assurez-vous que les permissions sont correctes (755 pour les dossiers, 644 pour les fichiers)"
echo "3. Redémarrez le serveur Next.js"
echo "4. Testez avec: curl -I 'https://votredomaine.com/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf'" 