export type Language = "pt" | "en" | "es" | "fr"

export const translations = {
  pt: {
    // Header
    appTitle: "Blockchain Data Share",
    appSubtitle: "Simulador de Compartilhamento Descentralizado",
    connectWallet: "Conectar Carteira",

    // Tabs
    nftAndOwnerTab: "NFT e Proprietário",
    systemsTab: "Sistemas",
    ownersTab: "Proprietários",
    timelineTab: "Linha do Tempo",

    // Buttons
    createNFT: "Criar NFT",
    createEntity: "Incluir Sistema", // Changed from "Criar Sistema" to "Incluir Sistema"
    generateOwner: "Gerar Proprietário",
    keys: "Chaves",
    requests: "Solicitações",
    managePermissions: "Gerenciar Permissões",
    viewAllData: "Ver Todos os Dados",
    transferNFT: "Transferir NFT",
    addData: "Adicionar Dados",
    loadData: "Carregar Dados",
    requestPermission: "Solicitar Permissão",
    writeData: "Escrever Dados",

    // Labels
    owner: "Proprietário",
    previousOwner: "Ex-Proprietário",
    entity: "Sistema", // Changed from "Entidade" to "Sistema"
    title: "Título",
    description: "Descrição",
    metadata: "Metadados",
    status: "Status",
    network: "Rede",
    active: "Ativa",

    // Permissions
    readPermission: "Permissão de Leitura",
    writePermission: "Permissão de Escrita",
    noReadPermission: "Sem Permissão de Leitura",
    noWritePermission: "Sem Permissão de Escrita",

    // Timeline
    walletConnected: "Carteira Conectada",
    nftCreated: "NFT Criada",
    entityCreated: "Sistema Criado", // Changed from "Entidade Criada" to "Sistema Criado"
    dataUpdated: "Dados Atualizados",
    permissionGranted: "Permissão Concedida",
    permissionRevoked: "Permissão Revogada",
    nftTransferred: "NFT Transferida",

    // Welcome Dialog
    welcomeTitle: "Bem-vindo ao Blockchain Data Share",
    welcomeSubtitle: "Entenda o Poder da Web3 e do Blockchain",
    whatIsWeb3Title: "O que é Web3 e Blockchain?",
    whatIsWeb3Text:
      "Web3 representa a nova geração da internet, onde você tem controle total sobre seus dados. O blockchain é como um livro de registros digital impossível de alterar, onde todas as transações ficam gravadas de forma permanente e segura. Pense nele como um caderno compartilhado que todos podem ler, mas ninguém pode apagar ou modificar páginas já escritas.",
    whySecureTitle: "Por que Compartilhamento Seguro de Dados é Importante?",
    whySecureText:
      "Hoje, quando você compartilha informações entre sistemas diferentes, geralmente precisa confiar em intermediários. Com blockchain e NFTs (certificados digitais únicos), você elimina intermediários e mantém controle total. É como ter uma chave mestra que só você decide com quem compartilhar.",
    projectPurposeTitle: "Objetivo deste Simulador",
    projectPurposeText:
      "Este projeto demonstra como a tecnologia blockchain pode revolucionar o compartilhamento de dados entre sistemas de forma simples, rápida e segura. Você, como proprietário, tem controle total sobre quem pode ler ou modificar suas informações, sem depender de terceiros.",
    howToUseTitle: "Como Usar o Sistema",
    step1:
      "1. Conectar Carteira: Clique em 'Conectar Carteira' e crie seu nome de proprietário. Isso gera suas chaves de segurança únicas.",
    step2:
      "2. Criar NFT: Crie sua NFT (certificado digital) com título, descrição e dados iniciais. Ela será registrada na blockchain Stellar.",
    step3:
      "3. Incluir Sistemas: Adicione até 7 sistemas que poderão interagir com seus dados (ex: Sistema Financeiro, Sistema de Saúde).",
    step4:
      "4. Gerenciar Permissões: Controle quem pode ler ou escrever dados. Sistemas sem permissão veem apenas dados criptografados.",
    step5:
      "5. Adicionar Dados: Sistemas com permissão de escrita podem adicionar novos dados manualmente ou via arquivo JSON.",
    step6:
      "6. Transferir NFT: Gere carteiras para novos proprietários e transfira a NFT. O histórico completo fica registrado.",
    step7:
      "7. Acompanhar Histórico: Veja todas as ações na linha do tempo, incluindo transferências e mudanças de permissão.",
    getStarted: "Começar",
    dontShowAgain: "Não mostrar novamente",
  },
  en: {
    // Header
    appTitle: "Blockchain Data Share",
    appSubtitle: "Decentralized Sharing Simulator",
    connectWallet: "Connect Wallet",

    // Tabs
    nftAndOwnerTab: "NFT and Owner",
    systemsTab: "Systems",
    ownersTab: "Owners",
    timelineTab: "Timeline",

    // Buttons
    createNFT: "Create NFT",
    createEntity: "Add System", // Changed from "Create System" to "Add System"
    generateOwner: "Generate Owner",
    keys: "Keys",
    requests: "Requests",
    managePermissions: "Manage Permissions",
    viewAllData: "View All Data",
    transferNFT: "Transfer NFT",
    addData: "Add Data",
    loadData: "Load Data",
    requestPermission: "Request Permission",
    writeData: "Write Data",

    // Labels
    owner: "Owner",
    previousOwner: "Previous Owner",
    entity: "System", // Changed from "Entity" to "System"
    title: "Title",
    description: "Description",
    metadata: "Metadata",
    status: "Status",
    network: "Network",
    active: "Active",

    // Permissions
    readPermission: "Read Permission",
    writePermission: "Write Permission",
    noReadPermission: "No Read Permission",
    noWritePermission: "No Write Permission",

    // Timeline
    walletConnected: "Wallet Connected",
    nftCreated: "NFT Created",
    entityCreated: "System Created", // Changed from "Entity Created" to "System Created"
    dataUpdated: "Data Updated",
    permissionGranted: "Permission Granted",
    permissionRevoked: "Permission Revoked",
    nftTransferred: "NFT Transferred",

    // Welcome Dialog
    welcomeTitle: "Welcome to Blockchain Data Share",
    welcomeSubtitle: "Understand the Power of Web3 and Blockchain",
    whatIsWeb3Title: "What is Web3 and Blockchain?",
    whatIsWeb3Text:
      "Web3 represents the new generation of the internet, where you have complete control over your data. Blockchain is like an unchangeable digital ledger where all transactions are permanently and securely recorded. Think of it as a shared notebook that everyone can read, but no one can erase or modify pages already written.",
    whySecureTitle: "Why is Secure Data Sharing Important?",
    whySecureText:
      "Today, when you share information between different systems, you usually need to trust intermediaries. With blockchain and NFTs (unique digital certificates), you eliminate intermediaries and maintain total control. It's like having a master key that only you decide who to share with.",
    projectPurposeTitle: "Purpose of this Simulator",
    projectPurposeText:
      "This project demonstrates how blockchain technology can revolutionize data sharing between systems in a simple, fast, and secure way. You, as the owner, have complete control over who can read or modify your information, without depending on third parties.",
    howToUseTitle: "How to Use the System",
    step1:
      "1. Connect Wallet: Click 'Connect Wallet' and create your owner name. This generates your unique security keys.",
    step2:
      "2. Create NFT: Create your NFT (digital certificate) with title, description, and initial data. It will be registered on the Stellar blockchain.",
    step3:
      "3. Add Systems: Add up to 7 systems that can interact with your data (e.g., Financial System, Health System).",
    step4:
      "4. Manage Permissions: Control who can read or write data. Systems without permission see only encrypted data.",
    step5: "5. Add Data: Systems with write permission can add new data manually or via JSON file.",
    step6: "6. Transfer NFT: Generate wallets for new owners and transfer the NFT. The complete history is recorded.",
    step7: "7. Track History: See all actions in the timeline, including transfers and permission changes.",
    getStarted: "Get Started",
    dontShowAgain: "Don't show again",
  },
  es: {
    // Header
    appTitle: "Blockchain Data Share",
    appSubtitle: "Simulador de Compartición Descentralizada",
    connectWallet: "Conectar Cartera",

    // Tabs
    nftAndOwnerTab: "NFT y Propietario",
    systemsTab: "Sistemas",
    ownersTab: "Propietarios",
    timelineTab: "Línea de Tiempo",

    // Buttons
    createNFT: "Crear NFT",
    createEntity: "Incluir Sistema", // Changed from "Crear Sistema" to "Incluir Sistema"
    generateOwner: "Generar Propietario",
    keys: "Claves",
    requests: "Solicitudes",
    managePermissions: "Gestionar Permisos",
    viewAllData: "Ver Todos los Dados",
    transferNFT: "Transferir NFT",
    addData: "Agregar Datos",
    loadData: "Cargar Datos",
    requestPermission: "Solicitar Permiso",
    writeData: "Escribir Datos",

    // Labels
    owner: "Propietario",
    previousOwner: "Ex-Propietario",
    entity: "Sistema", // Changed from "Entidad" to "Sistema"
    title: "Título",
    description: "Descripción",
    metadata: "Metadatos",
    status: "Estado",
    network: "Red",
    active: "Activa",

    // Permissions
    readPermission: "Permiso de Lectura",
    writePermission: "Permiso de Escritura",
    noReadPermission: "Sin Permiso de Lectura",
    noWritePermission: "Sin Permiso de Escritura",

    // Timeline
    walletConnected: "Cartera Conectada",
    nftCreated: "NFT Creada",
    entityCreated: "Sistema Creado", // Changed from "Entidad Creada" to "Sistema Creado"
    dataUpdated: "Datos Actualizados",
    permissionGranted: "Permiso Concedido",
    permissionRevoked: "Permiso Revocado",
    nftTransferred: "NFT Transferida",

    // Welcome Dialog
    welcomeTitle: "Bienvenido a Blockchain Data Share",
    welcomeSubtitle: "Comprenda el Poder de Web3 y Blockchain",
    whatIsWeb3Title: "¿Qué es Web3 y Blockchain?",
    whatIsWeb3Text:
      "Web3 representa la nueva generación de internet, donde tienes control total sobre tus datos. Blockchain es como un libro de registros digital imposible de alterar, donde todas las transacciones quedan grabadas de forma permanente y segura. Piensa en él como un cuaderno compartido que todos pueden leer, pero nadie puede borrar o modificar páginas ya escritas.",
    whySecureTitle: "¿Por qué es Importante el Compartir Datos de Forma Segura?",
    whySecureText:
      "Hoy, cuando compartes información entre sistemas diferentes, generalmente necesitas confiar en intermediarios. Con blockchain y NFTs (certificados digitales únicos), eliminas intermediarios y mantienes control total. Es como tener una llave maestra que solo tú decides con quién compartir.",
    projectPurposeTitle: "Propósito de este Simulador",
    projectPurposeText:
      "Este proyecto demuestra cómo la tecnología blockchain puede revolucionar el compartir datos entre sistemas de forma simple, rápida y segura. Tú, como propietario, tienes control total sobre quién puede leer o modificar tu información, sin depender de terceros.",
    howToUseTitle: "Cómo Usar el Sistema",
    step1:
      "1. Conectar Cartera: Haz clic en 'Conectar Cartera' y crea tu nombre de propietario. Esto genera tus claves de seguridad únicas.",
    step2:
      "2. Crear NFT: Crea tu NFT (certificado digital) con título, descripción y datos iniciales. Se registrará en la blockchain Stellar.",
    step3:
      "3. Incluir Sistemas: Agrega hasta 7 sistemas que podrán interactuar con tus datos (ej: Sistema Financiero, Sistema de Salud).",
    step4:
      "4. Gestionar Permisos: Controla quién puede leer o escribir datos. Sistemas sin permiso ven solo datos encriptados.",
    step5:
      "5. Agregar Datos: Sistemas con permiso de escritura pueden agregar nuevos datos manualmente o vía archivo JSON.",
    step6:
      "6. Transferir NFT: Genera carteras para nuevos propietarios y transfiere la NFT. El historial completo queda registrado.",
    step7:
      "7. Seguir Historial: Ve todas las acciones en la línea de tiempo, incluyendo transferencias y cambios de permisos.",
    getStarted: "Comenzar",
    dontShowAgain: "No mostrar nuevamente",
  },
  fr: {
    // Header
    appTitle: "Blockchain Data Share",
    appSubtitle: "Simulateur de Partage Décentralisé",
    connectWallet: "Connecter Portefeuille",

    // Tabs
    nftAndOwnerTab: "NFT et Propriétaire",
    systemsTab: "Systèmes",
    ownersTab: "Propriétaires",
    timelineTab: "Chronologie",

    // Buttons
    createNFT: "Créer NFT",
    createEntity: "Inclure Système", // Changed from "Créer Système" to "Inclure Système"
    generateOwner: "Générer Propriétaire",
    keys: "Clés",
    requests: "Demandes",
    managePermissions: "Gérer les Permissions",
    viewAllData: "Voir Toutes les Données",
    transferNFT: "Transférer NFT",
    addData: "Ajouter Données",
    loadData: "Charger Données",
    requestPermission: "Demander Permission",
    writeData: "Écrire Données",

    // Labels
    owner: "Propriétaire",
    previousOwner: "Ancien Propriétaire",
    entity: "Système", // Changed from "Entité" to "Système"
    title: "Titre",
    description: "Description",
    metadata: "Métadonnées",
    status: "Statut",
    network: "Réseau",
    active: "Active",

    // Permissions
    readPermission: "Permission de Lecture",
    writePermission: "Permission d'Écriture",
    noReadPermission: "Pas de Permission de Lecture",
    noWritePermission: "Pas de Permission d'Écriture",

    // Timeline
    walletConnected: "Portefeuille Connecté",
    nftCreated: "NFT Créée",
    entityCreated: "Système Créé", // Changed from "Entité Créée" to "Système Créé"
    dataUpdated: "Données Mises à Jour",
    permissionGranted: "Permission Accordée",
    permissionRevoked: "Permission Révoquée",
    nftTransferred: "NFT Transférée",

    // Welcome Dialog
    welcomeTitle: "Bienvenue sur Blockchain Data Share",
    welcomeSubtitle: "Comprendre le Pouvoir du Web3 et de la Blockchain",
    whatIsWeb3Title: "Qu'est-ce que Web3 et Blockchain?",
    whatIsWeb3Text:
      "Web3 représente la nouvelle génération d'internet, où vous avez un contrôle total sur vos données. La blockchain est comme un registre numérique impossible à modifier, où toutes les transactions sont enregistrées de manière permanente et sécurisée. Pensez-y comme un cahier partagé que tout le monde peut lire, mais personne ne peut effacer ou modifier les pages déjà écrites.",
    whySecureTitle: "Pourquoi le Partage Sécurisé de Données est Important?",
    whySecureText:
      "Aujourd'hui, lorsque vous partagez des informations entre différents systèmes, vous devez généralement faire confiance à des intermédiaires. Avec la blockchain et les NFT (certificats numériques uniques), vous éliminez les intermédiaires et gardez un contrôle total. C'est comme avoir une clé maîtresse que vous seul décidez avec qui partager.",
    projectPurposeTitle: "Objectif de ce Simulateur",
    projectPurposeText:
      "Ce projet démontre comment la technologie blockchain peut révolutionner le partage de données entre systèmes de manière simple, rapide et sécurisée. Vous, en tant que propriétaire, avez un contrôle total sur qui peut lire ou modifier vos informations, sans dépendre de tiers.",
    howToUseTitle: "Comment Utiliser le Système",
    step1:
      "1. Connecter Portefeuille: Cliquez sur 'Connecter Portefeuille' et créez votre nom de propriétaire. Cela génère vos clés de sécurité uniques.",
    step2:
      "2. Créer NFT: Créez votre NFT (certificat numérique) avec titre, description et données initiales. Il sera enregistré sur la blockchain Stellar.",
    step3:
      "3. Inclure Systèmes: Ajoutez jusqu'à 7 systèmes qui pourront interagir avec vos données (ex: Système Financier, Système de Santé).",
    step4:
      "4. Gérer Permissions: Contrôlez qui peut lire ou écrire des données. Les systèmes sans permission voient uniquement des données cryptées.",
    step5:
      "5. Ajouter Données: Les systèmes avec permission d'écriture peuvent ajouter de nouvelles données manuellement ou via fichier JSON.",
    step6:
      "6. Transférer NFT: Générez des portefeuilles pour de nouveaux propriétaires et transférez le NFT. L'historique complet est enregistré.",
    step7:
      "7. Suivre Historique: Voyez toutes les actions dans la chronologie, y compris les transferts et changements de permissions.",
    getStarted: "Commencer",
    dontShowAgain: "Ne plus afficher",
  },
}
