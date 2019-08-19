// the display is generated automatically thanks to the table. They must be built according to the desired view, for example:
// 'index' : [
//          [ <- rows
//              [1] <- columns
//          ],
//          [
//              [5, 6] <- columns
//              [2, [3,4]] <- columns with 2 rows choices
//          ]
// ]
// give :
//     [1]
//  [5]   [2]
//  [6]  [3][4]

const psl = {
    // all quests id before 3 choices in the game
    '3choice' : [117,114,110,122,147,148,15,53,52,77,68,76,69,70,100,101,154,156,171,172,195,192,201,219,217,216,209,235,241,358,301,318],
    // all quests id before 2 choices in the game
    '2choice' : [113,106,119,125,135,130,140,18,29,23,35,45,40,49,61,72,67,85,79,90,93,158,164,165,174,185,175,188,208,215,204,232,221,226,236,256,255,250,263,267,274,278,286,291,296,304,309,313,321,320,322],
    // all quests id before 5 choices in the game
    '5choice' : [257,260,262,252],

    // Mon histoire - charr
    '1' : [
        [
            [77]
        ],
        [
            [60,61,[65,63],66,68],  [71,72,[74,73],75,76],  [59,62,64,67,[69,70]]
        ],
        [
            [83,84,85,[87,86]],  [78,79,[80,81],82],  [88,89,90,[91,92]]
        ],
        [
            [93]
        ],
        [
            [94,97,100],  [95,98,101]
        ],
        [
            [104],  [105],  [102]
        ]
    ],
    // Mon histoire - norn
    '2' : [
        [
            [154]
        ],
        [
            [155,157,158,[160,161],156],  [162,164,[169,168],170,171],  [159,163,165,[166,167],172]
        ],
        [
            [173,174,[176,182],181],  [184,183,185,[187,186]],  [175,[177,178],179,180]
        ],
        [
            [188]
        ],
        [
            [197,191,195],  [189,194,192]
        ],
        [
            [200],  [199],  [198]
        ]
    ],
    // Mon histoire - human
    '3' : [
        [
            [117]
        ],
        [
            [124,116,113,[111,112],114],  [123,109,106,[108,107],110],  [115,118,119,[120,121],122]
        ],
        [
            [125,[126,127],128,139],  [134,135,[137,136],138],  [129,130,[132,131],133]
        ],
        [
            [140]
        ],
        [
            [141,145,147],  [142,144,148]
        ],
        [
            [151],  [152],  [150]
        ]
    ],
    // Mon histoire - sylvarie
    '7' : [
        [
            [201]
        ],
        [
            [203,205,208,[218,211],219],  [212,213,214,215,[217,216]],  [202,206,204,[210,207],209]
        ],
        [
            [230,231,232,[233,234]],  [220,221,[222,223],224],  [225,226,[228,227],229]
        ],
        [
            [236]
        ],
        [
            [239,238,235],  [237,244,241]
        ],
        [
            [247],  [243],  [246]
        ]
    ],
    // Mon histoire - asura
    '8' : [
        [
            [15]
        ],
        [
            [17,16,22,18,[19,20]],  [25,28,29,[30,31],33],  [21,24,23,[26,32],27]
        ],
        [
            [34,35,[37,36],38],  [44,45,[48,46],47],  [39,40,[43,41],42]
        ],
        [
            [49]
        ],
        [
            [50,56,53],
            [51,57,52]
        ],
        [
            [54],
            [55],
            [58]
        ]
    ],
    // Les Ordres de la Tyrie
    '9' : [
        [
            [358]
        ],
        // orders choice
        [
            [251,256,[254,261],257],
            [253,255,[258,259],260],
            [248,249,250,[262,252]]
        ],
        // races explo choice
        [
            [263,[266,264],265],
            [267,[270,268],269],
            [271,272,273],
            [274,[275,276],277],
            [278,[279,280],281]
        ],
        // order quests
        [
            [285], //d
            [290], //w
            [295] //v
        ],
        [
            [282]
        ],
        [
            [286,[287,288]], //d
            [291,[292,293]], //w
            [296,[298,297]] //v
        ],
        [
            [283]
        ],
        [
            [289], //d
            [294], //w
            [299] //v
        ],
        [
            [284]
        ]
    ],
    // Le dragon ancestral Zhaïtan
    '10' : [
        [
            [301]
        ],
        [
            [304,[302,303],305], // dishonored by allies
            [309,[307,308],310], // letting an innocent die
            [312,313,[315,314]] // making another suffer
        ],
        [
            [300]
        ],
        [
            [306], // dishonored by allies
            [311], // letting an innocent die
            [316] // making another suffer
        ],
        [
            [321,[334,335],320]
        ],
        [
            [337,339],
            [336,338]
        ],
        [
            [318]
        ],
        [
            [325,326,327], //d
            [331,332,333], //w
            [328,329,330] //v
        ],
        [
            [322,[317,319],323,324]
        ]
    ],


    // 1. À l'orée de Maguuma
    '11' : [],
    // 2. Emprise maléfique
    '12' : [],
    // 3. L'ombre du dragon : 1re partie
    '13' : [],
    // 4. L'ombre du dragon : 2e partie
    '14' : [],
    // 5. Le spectre du temps
    '15' : [],
    // 6. La voie des ronces
    '16' : [],
    // 7. Les graines de la vérité
    '17' : [],
    // 8. Le point de non-retour
    '18' : [],
    // 1. Prologue : ralliement à Maguuma
    '19' : [],
    // 2. Arrachés au ciel
    '32' : [],
    // 3. Établir une base avancée
    '41' : [],
    // 4. Dans la jungle
    '34' : [],
    // 5. Sur leurs traces
    '26' : [],
    // 6. Prisonniers du dragon
    '33' : [],
    // 7. Précieux effets
    '21' : [],
    // 8. Cité de l'espoir
    '20' : [],
    // 9. Le chemin du prédateur
    '35' : [],
    // 10. Curieuses observations
    '31' : [],
    // 11. Racines de la terreur
    '36' : [],
    // 12. En avant
    '23' : [],
    // 13. Connaissances cachées
    '22' : [],
    // 14. Découpe de signe
    '42' : [],
    // 15. Récolte amère
    '27' : [],
    // 16. Corps et âmes
    '25' : [],
    // 1. Aube
    '85' : [],
    // 2. Un bug dans le système
    '86' : [],
    // 3. Longue vie à la liche
    '87' : [],
    // 4. Guidés par une étoile
    '88' : [],
    // 5. Quitte ou double
    '89' : [],
    // 6. Guerre éternelle
    '90' : [],
    // 1. Allumer la flamme
    '83' : [],
    // 2. Ouvrir la voie
    '67' : [],
    // 3. Nuit des incendies
    '82' : [],
    // 4. Le sacrifice
    '72' : [],
    // 5. Souvenirs cristallins
    '79' : [],
    // 6. Sol consacré
    '69' : [],
    // 7. Affronter la vérité
    '80' : [],
    // 8. La marche à suivre
    '68' : [],
    // 9. En partance
    '71' : [],
    // 10. L'ennemi de mon ennemi
    '75' : [],
    // 11. Bête de guerre
    '76' : [],
    // 12. Tuer un dieu
    '81' : [],
    // 13. Petite victoire (Épilogue)
    '78' : [],
    // Leçon d'histoire de la saison 1
    '39' : [],
    // 1. Hors des ombres
    '46' : [],
    // 2. L'Embrasement
    '56' : [],
    // 3. Une fissure dans la glace
    '63' : [],
    // 4. La Tête du serpent
    '64' : [],
    // 5. Point d'ignition
    '65' : [],
    // 6. À la fin du chemin
    '66' : [],
}

export default psl