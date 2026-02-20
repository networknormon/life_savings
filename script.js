function generateOwned(total, ownedCount) {
    return Array(total).fill(false).map((_, i) => i < ownedCount);
}

const initialMagicCards = [
    { name: "A Realm Reborn", price: 0.28, image: "A Realm Reborn.jpg" },
    { name: "Absolute Virtue", price: 3.49, image: "Absolute Virtue .jpg" },
    { name: "Aerith Gainsborough", price: 1.79, image: "Aerith.jpg" },
    { name: "Aettir and Priwen", price: 5.43, image: "Aettir and Priwen.jpg" },
    { name: "Ancient Adamantoise", price: 3.90, image: "Ancient Adamantoise.jpg" },
    { name: "Ardyn, the Usurper", price: 1.08, image: "Ardyn, the Usurper.jpg" },
    { name: "Battle Menu", price: 0.20, image: "BattleMenu.jpg" },
    { name: "Buster Sword", price: 31.19, image: "Buster Sword.jpg" },
    { name: "Cecil, Dark Knight // Cecil, Redeemed Paladin", price: 1.25, image: "Cecil, Dark Knight : Cecil, Redeemed Paladin.jpg" },
    { name: "Cid, Timeless Artificer", price: 4.18, image: "Cid, Timeless Artificer.jpg" },
    { name: "Clive, Ifrit's Dominant // Ifrit, Warden of Inferno", price: 2.98, image: "Clive, Ifrit's Dominant : Ifrit, Warden of Inferno.jpg" },
    { name: "Cloud, Midgar Mercenary", price: 17.98, image: "Cloud, Midgar Mercenary.jpg" },
    { name: "Dark Confidant", price: 3.66, image: "Dark Confidant.jpg" },
    { name: "Emet-Selch, Unsundered // Hades, Sorcerer of Eld", price: 2.50, image: "Emet-Selch, Unsundered : Hades, Sorcerer of Eld.jpg" },
    { name: "Esper Origins // Summon: Esper Maduin", price: 2.50, image: "Esper Origins : Summon- Esper Maduin.jpg" },
    { name: "Genji Glove", price: 2.50, image: "Genji Glove .jpg" },
    { name: "Gogo, Master of Mimicry", price: 2.50, image: "Gogo, Master of Mimicry.jpg" },
    { name: "Golbez, Crystal Collector", price: 2.50, image: "Golbez, Crystal Collector.jpg" },
    { name: "Jecht, Reluctant Guardian // Braska's Final Aeon", price: 2.50, image: "Jecht, Reluctant Guardian : Braska's Final Aeon.jpg" },
    { name: "Jumbo Cactuar", price: 2.50, image: "Jumbo Cactuar.jpg" },
    { name: "Kefka, Court Mage // Kefka, Ruler of Ruin", price: 2.50, image: "Kefka, Court Mage : Kefka, Ruler of Ruin.jpg" },
    { name: "Lightning, Army of One", price: 2.50, image: "Lightning, Andanada.jpg" },
    { name: "Lindblum, Industrial Regency // Mage Siege", price: 2.50, image: "Lindblum, Industrial Regency : Mage Siege.jpg" },
    { name: "Machinist's Arsenal", price: 2.50, image: "Machinist's Arsenal .jpg" },
    { name: "Memories Returning", price: 2.50, image: "Memories Returning.jpg" },
    { name: "Minwu, White Mage", price: 2.50, image: "Minwu, White Mage.jpg" },
    { name: "Nibelheim Aflame", price: 2.50, image: "Nibelheim Aflame.jpg" },
    { name: "Quina, Qu Gourmet", price: 2.50, image: "Quina, Qu Gourmet.jpg" },
    { name: "Restoration Magic", price: 2.50, image: "Restoration Magic.jpg" },
    { name: "Sephiroth, Fabled SOLDIER // Sephiroth, One-Winged Angel", price: 2.50, image: "Sephiroth, Fabled SOLDIER : Sephiroth, One-Winged Angel.jpg" },
    { name: "Starting Town", price: 2.50, image: "Starting Town.jpg" },
    { name: "Summon: Bahamut", price: 2.50, image: "Bahamut.jpg" },
    { name: "Summon: G.F. Cerberus", price: 2.50, image: "Summon- G.F. Cerberus.jpg" },
    { name: "Summon: Knights of Round", price: 2.50, image: "Summon- Knights of Round.jpg" },
    { name: "Summon: Primal Odin", price: 2.50, image: "Summon- Primal Odin.jpg" },
    { name: "Summon: Titan", price: 2.50, image: "Summon- Titan .jpg" },
    { name: "Terra, Magical Adept // Esper Terra", price: 2.50, image: "Terra, Magical Adept : Esper Terra.jpg" },
    { name: "The Earth Crystal", price: 2.50, image: "The Earth Crystal.jpg" },
    { name: "The Fire Crystal", price: 2.50, image: "The Fire Crystal .jpg" },
    { name: "Tifa Lockhart", price: 2.50, image: "Tifa Lockhart.jpg" },
    { name: "Traveling Chocobo", price: 2.50, image: "Traveling Chocobo.jpg" },
    { name: "Vaan, Street Thief", price: 2.50, image: "Vaan, Street Thief .jpg" },
    { name: "Vivi Ornitier", price: 2.50, image: "Vivi Ornitier.jpg" },
    { name: "Y'shtola Rhul", price: 2.50, image: "Y'shtola Rhul.jpg" },
    { name: "Yuna, Hope of Spira", price: 2.50, image: "Yuna, la Esperanza de Spira.jpg" }
];

let appData = {
    salary: 1084.20,
    expenses: 329.92, // Gastos Fijos
    variableExpenses: 150.00, // Gastos Variables
    allocation: 30,
    currentSavings: 2100, 
    savingsGoal: 10000,   
    collections: [
        { id: 1, name: "Magic: FF Master Set", publisher: "Wizards", type: "cards", items: initialMagicCards, ownedList: Array(45).fill(false), expanded: false, theme: "purple", icon: "🔮", priority: 3 },
        { id: 2, name: "Vagabond", publisher: "Ivrea", type: "manga", totalItems: 37, ownedList: generateOwned(37, 2), pricePerItem: 7.60, expanded: false, theme: "col-theme-stone", icon: "🗡️", folder: "Vagabond", ext: "jpg", priority: 1 },
        { id: 3, name: "Slam Dunk (Kanzenban)", publisher: "Ivrea", type: "manga", totalItems: 20, ownedList: generateOwned(20, 1), pricePerItem: 14.25, expanded: false, theme: "col-theme-orange", icon: "🏀", folder: "SlamDunk", ext: "webp", priority: 2 },
        { id: 4, name: "Vinland Saga", publisher: "Planeta", type: "manga", totalItems: 29, ownedList: generateOwned(29, 3), pricePerItem: 12.30, expanded: false, theme: "col-theme-blue", icon: "🛡️", folder: "VinlandSaga", ext: "webp", priority: 1 },
        { id: 5, name: "Dragon Ball Ultimate", publisher: "Planeta", type: "manga", totalItems: 34, ownedList: generateOwned(34, 7), pricePerItem: 8.60, expanded: false, theme: "col-theme-yellow", icon: "🐉", folder: "DragonBall", ext: "webp", priority: 2 }
    ]
};

// --- CONFIGURACIÓN DE AWS DYNAMODB ---
const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_HT76kHw12';
const IDENTITY_POOL_ID = 'eu-north-1:d5157883-71f1-475b-8e0e-9774ab7607de';

AWS.config.region = REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: localStorage.getItem('cognito_id_token')
    }
});

const docClient = new AWS.DynamoDB.DocumentClient();
let dbUserId = null;

// Autenticamos y cargamos datos al entrar
AWS.config.credentials.get((err) => {
    if (err) {
        console.error("Error validando token con AWS:", err);
        return;
    }
    dbUserId = AWS.config.credentials.identityId;
    console.log("Conectado a AWS con ID:", dbUserId);
    loadDataFromDynamo();
});

function loadDataFromDynamo() {
    const params = {
        TableName: 'ColeccionesData',
        Key: { userId: dbUserId }
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Error descargando datos:", err);
        } else if (data.Item && data.Item.collectionsData) {
            console.log("Datos cargados desde la nube ☁️");
            const savedCollections = JSON.parse(data.Item.collectionsData);
            
            appData.collections.forEach(col => {
                if(savedCollections[col.id]) col.ownedList = savedCollections[col.id];
            });
            
            if (data.Item.finances) {
                 appData.salary = data.Item.finances.salary !== undefined ? data.Item.finances.salary : appData.salary;
                 appData.expenses = data.Item.finances.expenses !== undefined ? data.Item.finances.expenses : appData.expenses;
                 appData.variableExpenses = data.Item.finances.variableExpenses !== undefined ? data.Item.finances.variableExpenses : appData.variableExpenses;
                 appData.allocation = data.Item.finances.allocation !== undefined ? data.Item.finances.allocation :
