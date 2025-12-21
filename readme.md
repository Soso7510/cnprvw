Titre : Génère une application mobile‑first en HTML, CSS, bootstrap et JavaScript pour le jeu Black castle.

Instructions : Crée une application web mobile‑first (responsive design) en HTML, CSS et JavaScript qui implémente les règles et interfaces suivantes :

I. Description rapide
Black castle est un jeu de stratégie compétitive reposant sur une mécanique de course et de capture.

Deux joueurs s’affrontent sur un même parcours, chacun visant à conquérir le château final.

Le système de progression s’inspire du Yatzy : à chaque tour, un joueur lance 5 dés, jusqu’à 3 fois, pour obtenir la meilleure combinaison possible.

La combinaison détermine l’avancée du joueur sur le parcours.

II. Tableau de précision
II.a – Combinaisons possibles
Implémente les combinaisons suivantes avec leurs forces et chances :

Nada (N) → Force 1, Chance +2

Petite suite (PS) → Force 7, Chance +0.5

Suite (S) → Force 12, Chance +1.3

Double (D) → Force 2, Chance +1.5

Brelan (L) → Force 4, Chance +1

Full (F) → Force 6, Chance +0.4

Carré (C) → Force 8, Chance +0.2

Yatzy (T) → Force 30, Chance +0

II.b – Terrains et résistances
Types de terrains avec résistances :

Plaine (3, min 1)

Ville (4, min 2)

Fleuve (5, min 3)

Forêt (6, min 3)

Montagne (10, min 5)

Mer (10, min 5)

Tour (13, min 3)

Black castle (100, min 10)

Résistance endommagée : baisse de 20 % pendant 4 tours, sans descendre sous la résistance minimale.

II.c – Autres fonctionnalités
Chance : s’accumule selon les combinaisons et influe sur plusieurs compartiments.

Jauge : limite initiale 30, bonus jusqu’à 15 selon la chance (donc entre 30 et 45).

Cartes mémoire : 3 emplacements pour sauvegarder ou rejouer une combinaison.

III. Règles du jeu
Deux joueurs, chacun avec jauge, cartes mémoire et indicateur de chance.

Le joueur qui initie choisit le nombre de cartes du parcours (10, 20 ou 30).

Les cartes sont générées aléatoirement parmi les terrains, avec un seul château final.

Les joueurs commencent sur la première carte.

Lorsqu’ils sont sur la même carte, celle‑ci est activée avec un contour stylisé mélangeant leurs couleurs (rouge orangé pour joueur 1, bleu clair pour joueur 2).

Déroulement d’un tour :

Lancer 5 dés (jusqu’à 3 fois, avec possibilité de bloquer certains dés).

Évaluer la combinaison et choisir une action : jouer, sauvegarder, activer mémoire, utiliser jauge, s’abstenir (ajout à jauge), relancer.

Si attaque, comparer force à résistance du terrain. Sinon, tour terminé.

Résolution des terrains :

Force > Résistance → traverse.

Force ≥ 1,5 × Résistance → terrain endommagé 2 tours.

Résistance ≥ 1,5 × Force → recule d’un terrain.

Excédent de force → appliqué au terrain suivant.

Force > Résistance du terrain suivant → franchit deux terrains en un tour.

Condition de victoire : conquérir le château final.

IV. Interface graphique
IV.a – Dés
Forme carrée stylisée, chaque face avec une couleur distincte.
pas de chffre . utiliser <i class="bi bi-dice-1"></i> à <i class="bi bi-dice-6"></i>

Animation de 0,5 s : apparition de gauche à droite en roulant avant de se figer.

IV.b – Terrains
Cartes représentant les terrains : 70 % illustration (icônes font awesom provisoires), 30 % résistance.µPlaine (3, min 1)

Ville fa city

Fleuve fa river

Forêt fa tree

Montagne fa mountain

Mer fa water ladder

Tour building

Black castle fa castle

Si résistance affaiblie : couleur différente + icône sablier + nombre de tours restants.

IV.c – Disposition
le jeu débute sur une page pour demander la longueur du parcours. les pseudo (si ce n'est pas rempli par defaut ce sera joueur 1 et 2 ) 

ensuite la page du jeu 
L’écran est divisé en 6 sections :

- Zone du joueur 2   pdp avatar a droite (au centre vertivalement). a gauche compartiment [ jauge pour la force acummulée. en dessous 4 carré pour la chance et les carte mémoire . lorsqu'une combinaison est mémorisé la cart mémoire affiche la ou les 2 lettres de la combinaison . par exemple = PS ]  des specificité de style sera a prévoir pour differencier l'indication de chance et les carte mémoire. les carte mémoire seront clickable lorsque qu'il le faudra.

- petite zone de message pour indique ce qu'il s'est passé au tour precedent ou l'état du jeu
- Parcours: les cartes represantant les lieux sont disposé horizontalement. ils peuvent depasser le cadre. on pourra scroller pour voir les carte qui depasse.
- les dés. une ligne pour les des une autre pour exploquer ce qui est obtenu plus la force associé. en début de tour il y en a pas de des. rien dans la ligne de dés et  un petit message "en attent que tel joeur lance" suffira dans la ligne d'info concernant les des 
- les boutton d'action (prefere des icon plutot que du texte.): relancer (si on peut plus relancer les dés le bouton ne fonctionne plus) , attaquer, sauvegarder (si il n'y a plus de carte memoir libre fermer le bouton) et remplir la jauge.
- Zone du joueur 1. similaire à zone de joeur 2. pdp avatar  à gauche le reste à droite
