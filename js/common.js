const languages = ['Es', 'En'];
const cardLanguages = {'En': 'English', 'Es': 'Spanish', 'Jp': 'Japanese', 'Kr': 'Korean'};
const setRegions = ['jp', 'kr', 'dl'];
const moduleList = ['home', 'cards'];
const cardSpecialRarities = ['ORR', 'ORR+B'];
const extraDeckCards = ['Fusion', 'Ritual'];

const htmlList = {
    cardsList: getCacheResource('./html/cards-list.html'),
    cards: getCacheResource('./html/cards.html'),
    home: getCacheResource('./html/home.html'),
}

const relatedCategories = [
{
    'short': 'mentions',
    'name': 'Mentions',
    'type': 0,
    'sort': true,
},
{
    'short': 'mentioned-by',
    'name': 'MentionedBy',
    'type': 0,
    'sort': true,
},
{
    'short': 'fusion-material-for',
    'name': 'FusionMaterialFor',
    'type': 0,
    'sort': true,
}];
const searchCategories = [
{
    'short': 'maximum-materials',
    'name': 'MaximumMaterials',
    'type': 1,
    'sort': false,
},
{
    'short': 'fusion-materials',
    'name': 'FusionMaterials',
    'type': 1,
    'sort': false,
},
{
    'short': 'equips-to',
    'name': 'EquipsTo',
    'type': 1,
    'sort': false,
},
{
    'short': 'supports',
    'name': 'Supports',
    'type': 1,
    'sort': false,
},
{
    'short': 'antisupports',
    'name': 'AntiSupports',
    'type': 1,
    'sort': false,
},
{
    'short': 'series',
    'name': 'Series',
    'type': 3,
    'sort': true,
},
{
    'short': 'requeriments',
    'name': 'Requeriments',
    'type': 2,
    'sort': false,
},
{
    'short': 'continuous-effects',
    'name': 'ContinuousEffects',
    'type': 2,
    'sort': false,
},
{
    'short': 'effects',
    'name': 'Effects',
    'type': 2,
    'sort': false,
},
{
    'short': 'properties',
    'name': 'Properties',
    'type': 3,
    'sort': true,
}];
const cardCategories = [relatedCategories, searchCategories];

const perPageValues = [10, 50, 100];
let currentPage = 1;
let typeRadio = 'all';
let effectRadio = 'any';
let searchOptions = {
    'sortby': 'Name',
    'sortDir': false,
    'perPage': 10,
    'filter': {
        'cardType': {
            'Monster': false,
            'Spell': false,
            'Trap': false,
        },
    },
    'filterButton': {
        'attribute': {
            'DARK': 0,
            'EARTH': 0,
            'FIRE': 0,
            'LIGHT': 0,
            'WATER': 0,
            'WIND': 0,
        },
        'type': {
            'Effect': 0,
            'Equip': 0,
            'Field': 0,
            'Fusion': 0,
            'Maximum': 0,
            'Normal': 0,
            'Ritual': 0,
            'Legend': 0,
        },
        'race': {},
        'level': {}
    },
    'filterSelect': {
        'rarities': [],
        'series': [],
        'properties': [],
    },
    'filterEffectSelect': {
        'activation': [],
        'actions': [],
        'stats': [],
        'cards': [],
        'summoning': [],
        'attack': [],
        'lp': [],
        'miscellaneous': [],
    },
    'filterText': {
        'search': {
            'text': '',
        },
        'MaximumAtk': {
            'min': '',
            'max': '',
            'exclude': '',
        },
        'ATK': {
            'min': '',
            'max': '',
            'exclude': '',
        },
        'DEF': {
            'min': '',
            'max': '',
            'exclude': '',
        },
        'startDate': {
            'day': 2,
            'month': 4,
            'year': 2020,
        },
        'endDate': {
            'day': '',
            'month': '',
            'year': '',
        }
    }
}

let userLang;
let cardLang;
let regionName;

if (localStorage.getItem('language') && languages.includes(localStorage.getItem('language')))  {
    userLang = localStorage.getItem('language');
} else {
    let browserLang = window.navigator.language;

    switch (browserLang.split('-')[0]) {
        case 'es':
            userLang = 'Es';
            break;
        default:
            userLang = 'En';
            break;
    }
}

if (localStorage.getItem('cardLanguage')) {
    cardLang = localStorage.getItem('cardLanguage');
} else {
    let browserLang = window.navigator.language;

    switch (browserLang.split('-')[0]) {
        case 'es':
            cardLang = 'Es';
            break;
        default:
            cardLang = 'En';
            break;
    }
}

if (localStorage.getItem('region')) {
    regionName = localStorage.getItem('region');
} else {
    regionName = 'all';
}

let data = {}
let json_list = getLanguageJSONList(userLang.toLowerCase());

function getLanguageJSONList(lang) {
    return {
        cardsMain: getCacheResource(`./data/${lang}/cards.min.json`),
        localization: getCacheResource(`./data/${lang}/localization.min.json`),
        effects: getCacheResource(`./data/${lang}/effects.min.json`),
        rarities: getCacheResource(`./data/${lang}/rarities.min.json`),
        sets: getCacheResource(`./data/${lang}/sets.min.json`)
    }
}

let json_card_list = getCardJSONList(cardLang.toLowerCase());

function getCardJSONList(lang) {
    return {
        cards: getCacheResource(`./data/${lang}/cards.min.json`),
        cardInfo: getCacheResource(`./data/${lang}/card_info.min.json`),
    }
}

let loadPromise = loadJSON(Object.assign(json_list, json_card_list), result => {
    data = result;
});

function loadJSON(list, success) {
    let results = {}

    let loadPromise = Object.entries(list).map(function(el) {
        return $.getJSON(el[1], function(result) {
            results[el[0]] = result;
        });
    });

    return Promise.all(loadPromise).then(function() {
        success(results);
    });
}

function getCacheResource(res) {
    return `${res}?v=${cache_ver}`;
}

function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0)
        return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function getLocalizedCardString(group, index) {
    if (data.cardInfo.hasOwnProperty(group) && data.cardInfo[group].hasOwnProperty(index)) {
        return data.cardInfo[group][index];
    } else {
        console.log(`Card string not found for "${group}, ${index}"`);
        return `${group}_${index}`;
    }
}

function getLocalizedCardEffect(name) {
    var action = data.effects.find((c) => c.abbreviation == name);

    if (action !== undefined) {
        return action.name;
    } else {
        console.log(`Card effect "${name}" not found`);
        return name;
    }
}

function getLocalizedString(group, index) {
    if (data.localization.hasOwnProperty(group) && data.localization[group].hasOwnProperty(index)) {
        return data.localization[group][index];
    } else {
        console.log(`Localization not found for "${group}, ${index}"`);
        return `${group}_${index}`;
    }
}

function findCardIsReleased(id) {
    var newCard = find(cardMainList, 'id', id);

    if (newCard != null && regionName != 'all') {
        if (!newCard.releaseDate[regionName]) {
            return null;
        }
    }

    return newCard;
}

function find(obj, key, value) {
    var result = null;

    $.each(obj, function(i, el) {
        if (el[key] == value) {
            result = el;
            return false;
        }
    })

    return result;
}

function indexOfArrayObject(array, key, value) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }

    return -1;
}

$.when($.ready, loadPromise).then(function() {
    generateSortedMainCardsList();
    generateSortedCardsList();

    generateCardSearchFilters();

    $('#navbar-language-selector span').text($(`#navbar-language-selector-${userLang.toLowerCase()}`).text());
    $(`#navbar-language-selector-${userLang.toLowerCase()}`).addClass('active');

    $('#navbar-card-language-selector span').text(getLocalizedString('language', cardLanguages[cardLang]));
    $(`#navbar-card-language-selector-${cardLang.toLowerCase()}`).addClass('active');

    $('#navbar-region-selector span').text(getLocalizedString('setRegion', regionName));
    $(`#navbar-region-selector-${regionName}`).addClass('active');

    $(window).on('popstate', () => loadModuleFromURL(false));
    loadModuleFromURL(true);
});

var cardList;
var cardMainList;

function generateSortedCardsList() {
    cardList = [...data.cards].sort((a, b) => {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}

function generateSortedMainCardsList() {
    cardMainList = [...data.cardsMain].sort((a, b) => {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}

var racesList = [];
var levelsList = [];
var raritiesList = [];
var seriesList = [];
var propertiesList = [];
var actionsList = [];

function generateCardSearchFilters(resetFilters = true) {
    racesList.length = 0;
    levelsList.length = 0;
    raritiesList.length = 0;
    seriesList.length = 0;
    propertiesList.length = 0;
    actionsList.length = 0;

    if (resetFilters) {
        searchOptions.filterButton.level = {};
        searchOptions.filterButton.race = {};
        searchOptions.filterSelect.rarities.length = 0;
        searchOptions.filterSelect.series.length = 0;
        searchOptions.filterSelect.properties.length = 0;
        searchOptions.filterEffectSelect.activation.length = 0;
        searchOptions.filterEffectSelect.actions.length = 0;
        searchOptions.filterEffectSelect.stats.length = 0;
        searchOptions.filterEffectSelect.cards.length = 0;
        searchOptions.filterEffectSelect.summoning.length = 0;
        searchOptions.filterEffectSelect.attack.length = 0;
        searchOptions.filterEffectSelect.lp.length = 0;
        searchOptions.filterEffectSelect.miscellaneous.length = 0;
    }

    cardList.forEach(card => {
        if (regionName != 'all' && (!card.releaseDate.hasOwnProperty(regionName) || !card.releaseDate[regionName])) {
            return;
        }

        if ('level' in card) {
            if (!levelsList.includes(card.level)) {
                levelsList.push(card.level);

                if (resetFilters) {
                    searchOptions.filterButton.level[card.level] = 0;
                }
            }
        }

        if ('race' in card) {
            if (!racesList.includes(card.race)) {
                racesList.push(card.race);

                if (resetFilters) {
                    searchOptions.filterButton.race[card.race] = 0;
                }
            }
        }

        if ('series' in card) {
            for (serie of card.series) {
                if (!seriesList.includes(serie)) {
                    seriesList.push(serie);
                }
            }
        }

        if ('properties' in card) {
            for (property of card.properties) {
                if (!propertiesList.includes(property) && property != 'LegendCard') {
                    propertiesList.push(property);
                }
            }
        }

        if ('actions' in card) {
            for (action of card.actions) {                
                if (!actionsList.includes(action.name)) {
                    actionsList.push(action.name);
                }
            }
        }

        if (regionName == 'all') {
            setRegions.forEach(region => {
                if (!card.rarities.hasOwnProperty(region)) {
                    return;
                }

                for (rarity of card.rarities[region]) {
                    if (!raritiesList.find(o => o.abbreviation === rarity)) {
                        var rarityInfo = find(data.rarities, 'abbreviation', rarity);

                        if (rarityInfo) {
                            raritiesList.push({
                                order: rarityInfo.order,
                                abbreviation: rarityInfo.abbreviation,
                                name: rarityInfo.name,
                            });
                        }
                    }
                }
            });
        } else {
            if (!card.rarities.hasOwnProperty(regionName)) {
                return;
            }

            for (rarity of card.rarities[regionName]) {
                if (!raritiesList.find(x => x.abbreviation === rarity)) {
                    var rarityInfo = find(data.rarities, 'abbreviation', rarity);

                    if (rarityInfo) {
                        raritiesList.push({
                            order: rarityInfo.order,
                            abbreviation: rarityInfo.abbreviation,
                            name: rarityInfo.name,
                        });
                    }
                }
            }
        }
    });

    levelsList.sort((a, b) => a - b);
    raritiesList.sort((a, b) => a.order - b.order);
    racesList.sort(function(a, b) {
        var textA = getLocalizedString('race', a).toUpperCase();
        var textB = getLocalizedString('race', b).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    seriesList.sort(function(a, b) {
        var textA = getLocalizedString('series', a).toUpperCase();
        var textB = getLocalizedString('series', b).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    propertiesList.sort(function(a, b) {
        var textA = getLocalizedString('properties', a).toUpperCase();
        var textB = getLocalizedString('properties', b).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    actionsList.sort(function(a, b) {
        var textA = getLocalizedCardEffect(a).toUpperCase();
        var textB = getLocalizedCardEffect(b).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}

function loadModuleFromURL(loadlast) {
    var urlVars = new URL(window.location.href).searchParams;

    if (urlVars.get('card')) {
        if (isNaN(urlVars.get('card'))) {
            loadModule('cardsList');
        } else {
            loadCard(urlVars.get('card'));
        }
    } else if (urlVars.get('cardid')) {
        loadCard(urlVars.get('cardid'));
    } else if (urlVars.get('cid')) {
        loadCard(urlVars.get('cid'));
    } else {
        if (loadlast) {
            loadLastModule();
        } else {
            loadModule('home');
        }
    }
}

function loadLastModule() {
    if (localStorage.getItem('module') && moduleList.includes(localStorage.getItem('module'))) {
        loadModule(localStorage.getItem('module'));
    } else {
        loadModule('home');
    }
}

let selectedModule = 'home';

function loadModule(moduleName, id = null) {
    if (moduleName == 'cardsList') {
        selectedModule = 'cardsList';

        $('.navbar-nav .nav-link').removeClass('active');
        $('#navbar-link-cards').addClass('active');

        $("#selected-module").load(htmlList['cardsList'], function() {
            //add day filters 
            $('.card-select-day').append('<option value="" data-translate-string="ui,Day"></option>');

            for(var i = 1; i <= 31; i++) {
                $('.card-select-day').append(`<option value="${i}">${String(i).padStart(2, "0")}</option>`);
            }

            //add month filters
            $('.card-select-month').append('<option value="" data-translate-string="ui,Month"></option>');

            for(var i = 1; i <= 12; i++) {
                $('.card-select-month').append(`<option value="${i}">${String(i).padStart(2, "0")}</option>`);
            }

            //add year filters
            $('.card-select-year').append('<option value="" data-translate-string="ui,Year"></option>');

            for(var i = 2020; i <= new Date().getFullYear(); i++) {
                $('.card-select-year').append(`<option value="${i}">${i}</option>`);
            }

            loadLanguage(userLang);

            //add filters
            raritiesList.forEach(rarity => {
                var listItem = `<li><button class="dropdown-item" data-filter-select-option="rarities" data-filter-select-value="${rarity.abbreviation}"><span>${rarity.name}</span></button></li>`;

                $('#search-filter-select-rarities-list').append(listItem);
            });

            seriesList.forEach(serie => {
                var listItem = `<li><button class="dropdown-item" data-filter-select-option="series" data-filter-select-value="${serie}"><span>${getLocalizedString('series', serie)}</span></button></li>`;

                $('#search-filter-select-series-list').append(listItem);
            });

            racesList.forEach(race => {
                var listItem = `<button id="search-filter-button-race-${race.toLowerCase()}" class="btn btn-outline-secondary" onclick="searchSetFilterButton('race', '${race}')"><span>${getLocalizedString('race', race)}</span></button>`;

                $('#search-filter-button-races-list').append(listItem);
            });

            levelsList.forEach(level => {
                var listItem = `<button id="search-filter-button-level-${level}" class="btn btn-outline-secondary" onclick="searchSetFilterButton('level', ${level})"><span>${level}</span></button>`;

                $('#search-filter-button-levels-list').append(listItem);
            });

            propertiesList.forEach(property => {
                var listItem = `<li><button class="dropdown-item" data-filter-select-option="properties" data-filter-select-value="${property}"><span>${getLocalizedString('properties', property)}</span></button></li>`;

                $('#search-filter-select-properties-list').append(listItem);
            });

            actionsList.forEach(property => {
                var action = data.effects.find((c) => c.abbreviation == property);

                if (action === undefined) {
                    return;
                }

                var listItem = `<button class="btn btn-outline-secondary" data-filter-effect-option="${action.type}" data-filter-effect-value="${action.abbreviation}"><span>${action.name}</span></button>`;

                $(`#search-filter-effect-${action.type}-list`).append(listItem);
            });

            //initial load
            loadCardSearchList(true, false);

            $(`#search-per-page-filter-${searchOptions['perPage']}`).addClass('active');
            $('#search-filter-per-page').text(`${getLocalizedString('ui', 'Show')} ${searchOptions['perPage']}`);

            $(`#search-sort-filter-${searchOptions['sortby'].toLowerCase()}`).addClass('active');
            $('#search-active-sort-filter').text(getLocalizedString('ui', searchOptions['sortby']));

            $(`input[type="radio"][name="typeRadio"][value="${typeRadio}"]`).prop('checked', true);
            $(`input[type="radio"][name="effectRadio"][value="${effectRadio}"]`).prop('checked', true);

            Object.entries(searchOptions['filter']).forEach(i => {
                Object.entries(i[1]).forEach(j => {
                    $(`#search-filter-${i[0].toLowerCase()}-${j[0].toLowerCase()}`).toggleClass('active', j[1]);
                });
            });

            Object.entries(searchOptions['filterButton']).forEach(i => {
                Object.entries(i[1]).forEach(j => {
                    switch (j[1]) {
                        case 1:
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).addClass('active');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).addClass('btn-outline-secondary');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).removeClass('btn-outline-danger');
                            break;
                        case 2:
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).addClass('active');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).addClass('btn-outline-danger');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).removeClass('btn-outline-secondary');
                            break;
                        default:
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).addClass('btn-outline-secondary');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).removeClass('active');
                            $(`#search-filter-button-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).removeClass('btn-outline-danger');
                    }
                });

                $(`#search-filter-button-${i[0]}`).toggleClass('active', Object.values(searchOptions['filterButton'][i[0]]).filter(v => v).length > 0);
            });

            Object.entries(searchOptions['filterText']).forEach(i => {
                Object.entries(i[1]).forEach(j => {
                    $(`#search-filter-${i[0].toLowerCase()}-${String(j[0]).toLowerCase()}`).val(searchOptions['filterText'][i[0]][j[0]]);
                });
            });

            Object.entries(searchOptions['filterSelect']).forEach(option => {
                option[1].forEach(value => {
                    $(`button[data-filter-select-option="${option[0]}"][data-filter-select-value="${value}"]`).addClass('active');
                });

                $(`#search-filter-select-${option[0]}`).toggleClass('active', searchOptions['filterSelect'][option[0]].length > 0);
            });

            Object.entries(searchOptions['filterEffectSelect']).forEach(option => {
                option[1].forEach(value => {
                    $(`button[data-filter-effect-option="${option[0]}"][data-filter-effect-value="${value}"]`).addClass('active');
                });

                $(`#search-filter-effect-${option[0]}`).toggleClass('active', searchOptions['filterEffectSelect'][option[0]].length > 0);
            });

            $('button[data-filter-select-option]').on('click', function(e) {
                const option = $(this).data('filter-select-option');
                const value = $(this).data('filter-select-value');
                searchSetFilterSelect(option, value);
            });

            $('button[data-filter-effect-option]').on('click', function(e) {
                const option = $(this).data('filter-effect-option');
                const value = $(this).data('filter-effect-value');
                searchSetFilterSelectEffect(option, value);
            });

            $('input[type=radio][name=typeRadio]').change(function() {
                typeRadio = $('input[type=radio][name="typeRadio"]:checked').val();
                loadCardSearchList();
            });

            $('input[type=radio][name=effectRadio]').change(function() {
                effectRadio = $('input[type=radio][name="effectRadio"]:checked').val();
                loadCardSearchList();
            });

            $('.search-filter-date').change(function() {
                loadCardSearchList();
            });

            window.scrollTo({top: 0, left: 0, behavior: 'instant'});
        });

        updatePageHistory(`${getLocalizedString('module', 'Cards')}`, 'card', 'all');
    } else if (moduleName == 'cards') {
        var urlVars = new URL(window.location.href).searchParams;

        if (id == null && urlVars.has('card') && isNaN(urlVars.get('card'))) {
            loadModule('cardsList');
            return;
        }

        selectedModule = 'cards';

        $('.navbar-nav .nav-link').removeClass('active');
        $('#navbar-link-cards').addClass('active');

        $("#selected-module").load(htmlList['cards'], function() {
            loadLanguage(userLang);

            generateCardTable('#card-info-table tbody');

            generateStatusBadge('#card-legend-status-badge', 'legend');

            $(`#locale-${cardLang.toLowerCase()}`).addClass('active');

            //add set lists
            if (regionName == "all") {
                $.each(setRegions, function(key, region) {
                    //add region to the card sets list
                    $('#card-sets').append(`<div id="card-sets-${region}" class="card-sets"><b>${getLocalizedString('setRegion', region)}</b><hr class="my-2"><div id="card-sets-list-${region}" class="card-sets-list"></div></div>`);
                });
            } else {
                //add region to the card sets list
                $('#card-sets').append(`<div id="card-sets-${regionName}" class="card-sets"><div id="card-sets-list-${regionName}" class="card-sets-list"></div></div>`);
            }

            //related cards search categories
            $('#card-related > h5.card-title').text(getLocalizedString('ui', 'Related'));
            $('#card-search-categories > h5.card-title').text(getLocalizedString('ui', 'SearchCategories'));

            $.each(cardCategories, function (key, sections) {
                $.each(sections, function(k, category) {
                    var category_name = category.name.toLowerCase().replace(/ /g, '-');

                    if (key == 0) {
                        $('#card-related-list').append(`<div id="card-search-${category.short}" class="search-categories"></div>`);
                    } else {
                       $('#card-search-categories-list').append(`<div id="card-search-${category.short}" class="search-categories"></div>`);
                    }

                    $(`#card-search-${category.short}`).append(`<span class="me-2">${getLocalizedString('searchCategory', category.name)}:</span>`);
                });
            });

            if (id != null) {
                loadCard(id);
            } else if (urlVars.has('card')) {
                loadCard(urlVars.get('card'));
            } else if (urlVars.has('cardid')) {
                loadCard(urlVars.get('cardid'));
            } else if (localStorage.getItem('cid')) {
                loadCard(localStorage.getItem('cid'));
            } else {
                loadCard(15150);
            }

            window.scrollTo({top: 0, left: 0, behavior: 'instant'});
        });
    } else {
        selectedModule = 'home';

        $('.navbar-nav .nav-link').removeClass('active');

        $("#selected-module").load(htmlList['home'], function() {
            loadLanguage(userLang);

            generateLatestCards();
            generateRandomCards();

            let url = new URL(window.location.href)
    
            if (url.searchParams.toString() != '') {
                url.searchParams.forEach((v,k) => url.searchParams.delete(k));
                history.pushState(null, '', url);
            }

            $('title').html(`${getLocalizedString('module', 'Home')} | Rush Duel DB`);
            $('#navbar-content').collapse('hide');
            window.scrollTo({top: 0, left: 0, behavior: 'instant'});
        });
    }

    localStorage.setItem('module', selectedModule);
}

function generateLatestCards(maxCardCount = 8) {
    var homeCards = [...data.cards].sort((a, b) => (b.id - a.id));

    if (regionName == 'all') {
        homeCards.sort((a,b) => new Date(b.preReleaseDate || b.releaseDate.jp).getTime() - new Date(a.preReleaseDate || a.releaseDate.jp).getTime());
    } else {
        homeCards.sort((a,b) => new Date(b.preReleaseDate || b.releaseDate[regionName] || '1999-01-01').getTime() - new Date(a.preReleaseDate || a.releaseDate[regionName] || '1999-01-01').getTime());
    }

    var cardCount = 0;
    var innerHtml = '';

    $.each(homeCards, function (key, card) {
        if (regionName != 'all' && (!card.releaseDate.hasOwnProperty(regionName) || !card.releaseDate[regionName])) {
            return;
        }

        var rarities = [];

        cardSpecialRarities.forEach(rarity => {
            if (regionName == 'all') {
                if (card.rarities.jp.includes(rarity)) {
                    rarities.push(rarity);
                }
            } else {
                if (card.rarities[regionName].includes(rarity)) {
                    rarities.push(rarity);
                }
            }
        });

        var imageCard = generateCardImage(card, rarities, false);

        if (imageCard) {
            innerHtml += imageCard;
            cardCount++;
        }

        if (cardCount == maxCardCount) {
            return false;
        }
    });

    $('#latest-cards-list').html(innerHtml);
}

function generateRandomCards(maxCardCount = 8) {
    var randomCards = [...data.cards].sort(() => Math.random()-0.5);
    var cardCount = 0;
    var innerHtml = '';

    $.each(randomCards, function (key, card) {
        if (regionName != 'all' && (!card.releaseDate.hasOwnProperty(regionName) || !card.releaseDate[regionName])) {
            return;
        }

        var imageCard = generateCardImage(card);

        if (imageCard) {
            innerHtml += imageCard;
            cardCount++;
        }

        if (cardCount == maxCardCount) {
            return false;
        }
    });

    $('#random-cards-list').html(innerHtml);
}

function generateCardImage(card, rarities = [], showRarityBadge = true) {
    var cardImage = '';
    var image = '';

    if ('artworks' in card) {
        var index = card.images.default;

        if (index in card.artworks && card.artworks[index].normal) {
            if (typeof card.artworks[index].normal === 'boolean') {
                cardImage = `${card.id}_${index}.webp`;
            } else {
                cardImage = card.artworks[index].normal;
            }
        }

        if (!cardImage || (cardSpecialRarities.some(r => rarities.includes(r)) && cardSpecialRarities.some(r => r in card.images))) {
            for(let i = cardSpecialRarities.length - 1; i >= 0; i--) {
                var rarity = cardSpecialRarities[i];
                var alt_index = card.images[rarity];

                if (rarity in card.images && card.artworks[alt_index][rarity]) {
                    if (typeof card.artworks[alt_index][rarity] === 'boolean') {
                        cardImage = `${card.id}_${alt_index}_${rarity}.webp`;
                    } else {
                        cardImage = card.artworks[alt_index][rarity];
                    }

                    break;
                }
            }
        }

        if (showRarityBadge && rarities.length) {
            var raritiesHtml = '';

            rarities.forEach(rarity => {
                raritiesHtml += `<div class="card-image-rarities text-center">${getRarityBadge(rarity)}</div>`;
            });

            cardImage = `<div class="card-image" title="${card.name}" style="background-image: url('images/cards/${cardImage}')" onclick="loadCard(${card.id})"><div class="d-flex flex-column flex-wrap justify-content-end align-items-end">${raritiesHtml}</div></div>`
        } else if (cardImage) {
            cardImage = `<img class="card-image" title="${card.name}" src="images/cards/${cardImage}" onclick="loadCard(${card.id})">`
        }
    }

    return cardImage;
}

function getActiveFiltersNum() {
    let num = 0;

    $.each(searchOptions.filter, function(i, v) {
        $.each(v, function(j, w) {
            if (w) {
                num += 1;
            }
        });
    });

    $.each(searchOptions.filterButton, function(i, v) {
        $.each(v, function(j, w) {
            if (w) {
                num += 1;
            }
        });
    });

    $.each(searchOptions.filterText, function(i, v) {
        if (i == 'startDate' || i == 'endDate') {
            if (v.day !== '' && v.month !== '' && v.year !== '') {
                num += 1;
            }
        } else {
            $.each(v, function(j, w) {
                if (w !== '') {
                    num += 1;
                }
            });
        }
    });

    $.each(searchOptions.filterSelect, function(i, v) {
        $.each(v, function(j, w) {
            if (w) {
                num += 1;
            }
        });
    });

    return num;
}

function searchResetFilter(search = true) {
    Object.entries(searchOptions['filter']).forEach((filter) => {
        Object.entries(filter[1]).forEach(val => {
            searchOptions['filter'][filter[0]][val[0]] = false;

            $(`#search-filter-${filter[0].toLowerCase()}-${val[0].toLowerCase()}`).removeClass('active');
        });
    });

    Object.entries(searchOptions['filterButton']).forEach((filter) => {
        Object.entries(filter[1]).forEach(val => {
            searchOptions['filterButton'][filter[0]][val[0]] = 0;

            $(`#search-filter-button-${filter[0].toLowerCase()}-${String(val[0]).toLowerCase()}`).removeClass('active');
        });

        $(`#search-filter-button-${filter[0].toLowerCase()}`).removeClass('active');
    });

    Object.entries(searchOptions['filterText']).forEach((filter) => {
        Object.entries(filter[1]).forEach(val => {
            searchOptions['filterText'][filter[0]][val[0]] = '';

            $(`#search-filter-${filter[0].toLowerCase()}-${String(val[0]).toLowerCase()}`).val('');
        });
    });

    for (option in searchOptions['filterSelect']) {
        searchOptions['filterSelect'][option].length = 0;
        $(`#search-filter-select-${option}`).removeClass('active');
        $(`button[data-filter-select-option="${option}"][data-filter-select-value]`).removeClass('active');
    }

    for (option in searchOptions['filterEffectSelect']) {
        searchOptions['filterEffectSelect'][option].length = 0;
        $(`#search-filter-effect-${option}`).removeClass('active');
        $(`button[data-filter-effect-option="${option}"][data-filter-effect-value]`).removeClass('active');
    }

    if (search) {
        loadCardSearchList(false, true);
    }
}

function searchChangeSortDir(search = true)
{
    searchOptions['sortDir'] = !searchOptions['sortDir'];
    $('#search-sort-filter-sort-dir').toggleClass('fa-sort-amount-down', !searchOptions['sortDir']);
    $('#search-sort-filter-sort-dir').toggleClass('fa-sort-amount-up', searchOptions['sortDir']);

    if (search) {
        loadCardSearchList(true);
    }
}

function searchChangePerPage(value) {
    if (value == searchOptions['perPage']) {
        return;
    }

    if (!perPageValues.includes(value)) {
        value = 10;
    }

    $('#search-per-page-filter a').removeClass('active');
    $(`#search-per-page-filter-${value}`).addClass('active');
    $('#search-filter-per-page').text(`${getLocalizedString('ui', 'Show')} ${value}`);

    searchOptions['perPage'] = value;

    loadCardSearchList(true);
}

function searchSetOrder(value, changeDir = true) {
    if (changeDir) {
        if (value == searchOptions['sortby']) {
            searchOptions['sortDir'] = !searchOptions['sortDir'];
            $('#search-sort-filter-sort-dir').toggleClass('fa-sort-amount-down', searchOptions['sortDir']);
            $('#search-sort-filter-sort-dir').toggleClass('fa-sort-amount-up', !searchOptions['sortDir']);
        } else {
            searchOptions['sortDir'] = false;
            $('#search-sort-filter-sort-dir').removeClass('fa-sort-amount-up');
            $('#search-sort-filter-sort-dir').addClass('fa-sort-amount-down');
        }
    }

    $('#search-sort-filter a').removeClass('active');
    $(`#search-sort-filter-${value.toLowerCase()}`).addClass('active');
    $('#search-active-sort-filter').text(getLocalizedString('ui', value));

    searchOptions['sortby'] = value;

    loadCardSearchList(true);
}

function searchSetFilter(option, value, search = true) {
    if (value != null) {
        searchOptions['filter'][option][value] = !searchOptions['filter'][option][value];
            $(`#search-filter-${option.toLowerCase()}-${value.toLowerCase()}`).toggleClass('active', searchOptions['filter'][option][value]);
    } else {
        for (optionValue in searchOptions['filter'][option]) {
            searchOptions['filter'][option][optionValue] = !searchOptions['filter'][option][optionValue];
            $(`#search-filter-${option.toLowerCase()}-${optionValue.toLowerCase()}`).toggleClass('active', searchOptions['filter'][option][optionValue]);
        }
    }

    if (search) {
        loadCardSearchList(true);
    }
}

function searchSetFilterButton(option, value, withExclude = true, search = true) {
    if (value != null) {
        switch(searchOptions['filterButton'][option][value]) {
            case 0:
                searchOptions['filterButton'][option][value] = 1;
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).addClass('active');
                break;

            case 1:
                searchOptions['filterButton'][option][value] = 2;
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).removeClass('btn-outline-secondary');
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).addClass('btn-outline-danger');
                break;

            default:
                searchOptions['filterButton'][option][value] = 0;
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).addClass('btn-outline-secondary');
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).removeClass('active');
                $(`#search-filter-button-${option.toLowerCase()}-${String(value).toLowerCase()}`).removeClass('btn-outline-danger');
        }
    } else {
        for (optionValue in searchOptions['filter'][option]) {
            switch(searchOptions['filterButton'][option][optionValue]) {
                case 0:
                    searchOptions['filterButton'][option][optionValue] = 1;
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).addClass('active');
                    break;

                case 1:
                    searchOptions['filterButton'][option][optionValue] = 2;
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).removeClass('btn-outline-secondary');
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).addClass('btn-outline-danger');
                    break;

                default:
                    searchOptions['filterButton'][option][optionValue] = 0;
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).addClass('btn-outline-secondary');
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).removeClass('active');
                    $(`#search-filter-button-${option.toLowerCase()}-${String(optionValue).toLowerCase()}`).removeClass('btn-outline-danger');
            }
        }
    }

    if (option == 'race' || option == 'level') {
        $(`#search-filter-button-${option.toLowerCase()}`).toggleClass('active', Object.values(searchOptions['filterButton'][option]).filter(v => v).length > 0);
    }

    if (search) {
        loadCardSearchList(true);
    }
}

function searchSetFilterText(option, value, isNumeric = true, search = true) {
    if (!(option in searchOptions['filterText']) || !(value in searchOptions['filterText'][option])) {
        return;
    }

    var text = $(`#search-filter-${option.toLowerCase()}-${String(value).toLowerCase()}`).val();

    if (isNumeric && text) {
        searchOptions['filterText'][option][value] = parseInt(text);
    } else {
        searchOptions['filterText'][option][value] = text;
    }

    if (search) {
        loadCardSearchList(true);
    }
}

function searchSetFilterSelect(option, value, search = true) {
    const index = searchOptions['filterSelect'][option].indexOf(value);

    if (index == -1) {
        searchOptions['filterSelect'][option].push(value);
        $(`button[data-filter-select-option="${option}"][data-filter-select-value="${value}"]`).toggleClass('active', true);
    } else {
        searchOptions['filterSelect'][option].splice(index, 1);
        $(`button[data-filter-select-option="${option}"][data-filter-select-value="${value}"]`).toggleClass('active', false);
    }

    $(`#search-filter-select-${option.toLowerCase()}`).toggleClass('active', searchOptions['filterSelect'][option].length > 0);

    if (search) {
        loadCardSearchList();
    }
}

function searchSetFilterSelectEffect(option, value, search = true) {
    const index = searchOptions['filterEffectSelect'][option].indexOf(value);

    if (index == -1) {
        searchOptions['filterEffectSelect'][option].push(value);
        $(`button[data-filter-effect-option="${option}"][data-filter-effect-value="${value}"]`).toggleClass('active', true);
    } else {
        searchOptions['filterEffectSelect'][option].splice(index, 1);
        $(`button[data-filter-effect-option="${option}"][data-filter-effect-value="${value}"]`).toggleClass('active', false);
    }

    $(`#search-filter-effect-${option.toLowerCase()}`).toggleClass('active', searchOptions['filterEffectSelect'][option].length > 0);

    if (search) {
        loadCardSearchList();
    }
}

function getFilterList(options) {
    var filterList = [];

    $.each(options, function(i, el) {
        let allFalse = true, allTrue = true;
        
        $.each(el, function(i2, el2) {
            allFalse = (allFalse && !el2);
            allTrue = allTrue && el2;
        });

        if (!(allFalse || allTrue)) {
            filterList.push(i);
        }
    });

    return filterList;
}

function getFilterTextList(options) {
    var startDateString = '';
    var endDateString = '';
    var minAtk = '';
    var maxAtk = '';
    var excludeAtk = '';
    var minDef = '';
    var maxDef = '';
    var excludeDef = '';
    var minMaximumAtk = '';
    var maxMaximumAtk = '';
    var excludeMaximumAtk = '';

    if (options.startDate.month && options.startDate.day && options.startDate.year) {
        startDateString = `${options.startDate.month}/${options.startDate.day}/${options.startDate.year}`;
    }

    if (options.endDate.month && options.endDate.day && options.endDate.year) {
        endDateString = `${options.endDate.month}/${options.endDate.day}/${options.endDate.year}`;
    }

    if (options.ATK.min !== '' && options.ATK.min >= 0) {
        minAtk = parseInt(options.ATK.min);
    }

    if (options.ATK.max !== '' && options.ATK.max >= 0) {
        maxAtk = parseInt(options.ATK.max);
    }

    if (options.ATK.exclude !== '' && options.ATK.exclude >= 0) {
        excludeAtk = parseInt(options.ATK.exclude);
    }

    if (options.DEF.min !== '' && options.DEF.min >= 0) {
        minDef = parseInt(options.DEF.min);
    }

    if (options.DEF.max !== '' && options.DEF.max >= 0) {
        maxDef = parseInt(options.DEF.max);
    }

    if (options.DEF.exclude !== '' && options.DEF.exclude >= 0) {
        excludeDef = parseInt(options.DEF.exclude);
    }

    if (options.MaximumAtk.min !== '' && options.MaximumAtk.min >= 0) {
        minMaximumAtk = parseInt(options.MaximumAtk.min);
    }

    if (options.MaximumAtk.max !== '' && options.MaximumAtk.max >= 0) {
        maxMaximumAtk = parseInt(options.MaximumAtk.max);
    }

    if (options.MaximumAtk.exclude !== '' && options.MaximumAtk.exclude >= 0) {
        excludeMaximumAtk = parseInt(options.MaximumAtk.exclude);
    }
    
    var textFilterList = {
        'startDate': startDateString,
        'endDate': endDateString,
        'minAtk': minAtk,
        'maxAtk': maxAtk,
        'excludeAtk': excludeAtk,
        'minDef': minDef,
        'maxDef': maxDef,
        'excludeDef': excludeDef,
        'minMaximumAtk': minMaximumAtk,
        'maxMaximumAtk': maxMaximumAtk,
        'excludeMaximumAtk': excludeMaximumAtk,
        'search': options.search.text,
    };

    return textFilterList;
}

function checkFilters(card, filterList, buttonFilterList, textFilterList, selectFilterList, effectFilterList, typeFilter, effectFilter, typeFilterCount = 0, effectFilterCount = 0) {
    if (textFilterList.startDate) {
        var startDate = new Date(`${textFilterList.startDate}`).getTime();

        if (!isNaN(startDate)) {
            if (regionName != 'all') {
                var releaseDate = new Date(card.releaseDate[regionName]).getTime();
            } else {
                var releaseDate = new Date(card.releaseDate[setRegions[0]]).getTime();
            }

            if (startDate > releaseDate) {
                return false;
            }
        }
    }

    if (textFilterList.endDate) {
        var endDate = new Date(`${textFilterList.endDate}`).getTime();

        if (!isNaN(endDate)) {
            if (regionName != 'all') {
                var releaseDate = new Date(card.releaseDate[regionName]).getTime();
            } else {
                var releaseDate = new Date(card.releaseDate[setRegions[0]]).getTime();
            }

            if (endDate < releaseDate) {
                return false;
            }
        }
    }

    if (textFilterList.minAtk !== '') {
        if (!('atk' in card) || card.atk < textFilterList.minAtk) {
            return false;
        }
    }

    if (textFilterList.maxAtk !== '') {
        if (!('atk' in card) || card.atk > textFilterList.maxAtk) {
            return false;
        }
    }

    if (textFilterList.excludeAtk !== '') {
        if (!('atk' in card) || card.atk == textFilterList.excludeAtk) {
            return false;
        }
    }

    if (textFilterList.minDef !== '') {
        if (!('def' in card) || card.def < textFilterList.minDef) {
            return false;
        }
    }

    if (textFilterList.maxDef !== '') {
        if (!('def' in card) || card.def > textFilterList.maxDef) {
            return false;
        }
    }

    if (textFilterList.excludeDef !== '') {
        if (!('def' in card) || card.def == textFilterList.excludeDef) {
            return false;
        }
    }

    if (textFilterList.minMaximumAtk !== '') {
        if (!('maximumAtk' in card) || card.maximumAtk < textFilterList.minMaximumAtk) {
            return false;
        }
    }

    if (textFilterList.maxMaximumAtk !== '') {
        if (!('maximumAtk' in card) || card.maximumAtk > textFilterList.maxMaximumAtk) {
            return false;
        }
    }

    if (textFilterList.excludeMaximumAtk !== '') {
        if (!('maximumAtk' in card) || card.maximumAtk == textFilterList.excludeMaximumAtk) {
            return false;
        }
    }

    for (let i = 0; i < filterList.length; i++) {
        if (!searchOptions['filter'][filterList[i]][card[filterList[i]]]) {
            return false;
        }
    }

    for (let i = 0; i < buttonFilterList.length; i++) {
        if (!(buttonFilterList[i] in card)) {
            return false;
        }

        if (buttonFilterList[i] == 'type' && typeFilter == 'all') {
            var matched = 0;

            $.each(searchOptions['filterButton'].type, function (type, value) {
                if (type == 'Legend') {
                    if (value == 1 && ('properties' in card && card.properties.includes('LegendCard'))) {
                        matched++;
                    } else if (value == 2 && (!('properties' in card) || !card.properties.includes('LegendCard'))) {
                        matched++;
                    }
                } else  if (card.hasOwnProperty('subtype')) {
                    if (value == 1 && (card.type === type || card.subtype === type)) {
                        matched++;
                    } else if (value == 2 && !(card.type === type || card.subtype === type)) {
                        matched++;
                    }
                } else {
                    if (value == 1 && card.type === type) {
                        matched++;
                    } else if (value == 2 && card.type !== type) {
                        matched++;
                    }
                }
            });

            if (typeFilterCount != matched) {
                return false;
            }
        } else {
            var filterActive = Object.values(searchOptions['filterButton'][buttonFilterList[i]]).includes(1);
            var filter = searchOptions['filterButton'][buttonFilterList[i]][card[buttonFilterList[i]]];

            if (buttonFilterList[i] == 'type') {
                var subtype = 0;

                if (card.hasOwnProperty('subtype')) {
                    subtype = searchOptions['filterButton'][buttonFilterList[i]][card.subtype];
                }

                if (!filterActive && searchOptions['filterButton'].type.Legend == 1) {
                    if (!('properties' in card) || !card.properties.includes('LegendCard')) {
                        return false;
                    }
                } else if (filterActive && filter == 0 && subtype == 0) {
                    if (searchOptions['filterButton'].type.Legend == 1 && 'properties' in card && card.properties.includes('LegendCard')) {
                        continue;
                    }

                    return false;
                } else if (filter == 2 || subtype == 2 || (searchOptions['filterButton'].type.Legend == 2 && 'properties' in card && card.properties.includes('LegendCard'))) {
                    return false;
                }
            } else {
                if (filterActive && filter == 0) {
                    return false;
                } else if (filter == 2) {
                    return false;
                }
            }
        }
    }

    for (let i = 0; i < selectFilterList.length; i++) {
        const filterValues = searchOptions['filterSelect'][selectFilterList[i]];
        const option = selectFilterList[i];

        if (!(option in card)) {
            return false;
        }

        switch(option) {
            case 'rarities':
                if (regionName != 'all') {
                    if (!card.rarities[regionName].some(r => searchOptions['filterSelect']['rarities'].includes(r)))
                        return false;
                } else {
                    var totalMatched = 0;

                    for (region in card.rarities) {
                        if (card.rarities[region].some(r => searchOptions['filterSelect']['rarities'].includes(r)))
                            totalMatched++;
                    }
                    
                    if (totalMatched == 0)
                        return false;
                }
                break;

            case 'series':
            case 'properties':
                if (!card[option].some(r => searchOptions['filterSelect'][option].includes(r)))
                    return false;
                break;

            default:
                break;
        }
    }

    if (effectFilter == 'all') {
        if (effectFilterCount > 0 && !('actions' in card)) {
            return false;
        }
        
        var effectCount = 0;
        var matchedEffects = 0;

        $.each(searchOptions['filterEffectSelect'], function (type, category) {
            $.each(category, function (type, action) {
                if (card.actions.findIndex((a) => a.name == action) >= 0) {
                    matchedEffects++;
                }
            });
        });

        if (effectFilterCount != matchedEffects) {
            return false;
        }
    } else if (effectFilterList.length) {
        if (!('actions' in card)) {
            return false;
        }

        var cardHasEffect = false;

        for (let i = 0; i < effectFilterList.length; i++) {
            const filterValues = searchOptions['filterEffectSelect'][effectFilterList[i]];
            const option = effectFilterList[i];
                
            if (card.actions.findIndex((a) => searchOptions['filterEffectSelect'][option].includes(a.name)) >= 0) {
                cardHasEffect = true;
                break;
            }
        }

        if (!cardHasEffect) {
            return false;
        }
    }

    var matchedText = false;

    if (textFilterList.search == "") {
        matchedText = true;
    } else {
        if (textFilterList.search.includes('ID:')) {
            var searchedID = parseInt(textFilterList.search.split('ID:')[1]);

            if (!isNaN(searchedID)) {
                if (card.id == searchedID || ('changesNameTo' in card && card.changesNameTo.includes(searchedID))) {
                    matchedText = true;
                }
            }
        } else if (card.name.toLowerCase().includes(textFilterList.search.toLowerCase()) || card.cardText.toLowerCase().includes(textFilterList.search.toLowerCase())) {
            matchedText = true;
        }
    }

    return matchedText;
}

var searchedCards = [];

function loadCardSearchList(updateSortFilter = false, resetPaginator = true) {
    const filterList = getFilterList(searchOptions['filter']);
    const buttonFilterList = getFilterList(searchOptions['filterButton']);
    const textFilterList = getFilterTextList(searchOptions['filterText']);
    const selectFilterList = [];
    const effectFilterList = [];
    var typeFilterCount = 0;
    var effectFilterCount = 0;
    searchedCards.length = 0;

    if (resetPaginator) {
        currentPage = 1;
    }

    if (typeRadio == 'all') {
        $.each(searchOptions['filterButton'].type, function (type, value) {
            if (value == 1 || value == 2) {
                typeFilterCount++;
            }
        });
    }

    for (option in searchOptions['filterSelect']) {
        if (searchOptions['filterSelect'][option].length) {
            selectFilterList.push(option);
        }
    }

    if (effectRadio == 'all') {
        $.each(searchOptions['filterEffectSelect'], function (type, category) {
            $.each(category, function (type, action) {
                effectFilterCount++;
            });
        });
    } else {
        for (option in searchOptions['filterEffectSelect']) {
            if (searchOptions['filterEffectSelect'][option].length) {
                effectFilterList.push(option);
            }
        }
    }

    //get all aproppiate cards
    $.each(cardList, function (key, card) {
        if (regionName != 'all' && (!card.releaseDate.hasOwnProperty(regionName) || !card.releaseDate[regionName])) {
            return;
        }

        //if correct add to array
        if (checkFilters(card, filterList, buttonFilterList, textFilterList, selectFilterList, effectFilterList, typeRadio, effectRadio, typeFilterCount, effectFilterCount)) {
            searchedCards.push(card);
        }
    });

    const activeFilters = getActiveFiltersNum();
    $('#active-filters-count').text(activeFilters == 0 ? '' : ` (${activeFilters})`);

    if (activeFilters) {
        $('#reset-filters').removeAttr('disabled');
    } else {
        $('#reset-filters').attr('disabled', '');
    }

    if (searchedCards.length) {
        if (updateSortFilter) {
            switch (searchOptions['sortby']) {
                case 'Level':
                    if (searchOptions['sortDir']) {
                        searchedCards.sort((a, b) => ((a.level || 13) - (b.level || 13)));
                    } else {
                        searchedCards.sort((a, b) => ((b.level || 0) - (a.level || 0)));
                    }

                    break;
                case 'ATK':
                    if (searchOptions['sortDir']) {
                        searchedCards.sort((a, b) => ((a.atk || 9900) - (b.atk || 9900)));
                    } else {
                        searchedCards.sort((a, b) => ((b.atk || 0) - (a.atk || 0)));
                    }

                    break;
                case 'DEF':
                    if (searchOptions['sortDir']) {
                        searchedCards.sort((a, b) => ((a.def || 9900) - (b.def || 9900)));
                    } else {
                        searchedCards.sort((a, b) => ((b.def || 0) - (a.def || 0)));
                    }

                    break;
                case 'MaximumAtk':
                    if (searchOptions['sortDir']) {
                        searchedCards.sort((a, b) => ((a.maximumAtk || 9900) - (b.maximumAtk || 9900)));
                    } else {
                        searchedCards.sort((a, b) => ((b.maximumAtk || 0) - (a.maximumAtk || 0)));
                    }

                    break;
                case 'ReleaseDate':
                    let region = regionName == 'all' ? setRegions[0] : regionName;
                    
                    if (searchOptions['sortDir']) {
                        searchedCards.sort((a, b) => {
                            var dateA = new Date(a.releaseDate[region]).getTime();
                            var dateB = new Date(b.releaseDate[region]).getTime();

                            return dateB - dateA;
                        });
                    } else {
                        searchedCards.sort((a, b) => {
                            var dateA = new Date(a.releaseDate[region]).getTime();
                            var dateB = new Date(b.releaseDate[region]).getTime();

                            return dateA - dateB;
                        });
                    }

                    break;
                case 'Name':
                default:
                    if (searchOptions['sortDir']) {
                        searchedCards.sort(function(a, b) {
                            var textA = a.name.toUpperCase();
                            var textB = b.name.toUpperCase();
                            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                        });
                    }
                    break;
            }
        }

        cardSearchLoadPage(currentPage);

        $.each(document.querySelectorAll('.card-item-stats'), function(key, item) {
            if (item.offsetWidth < 262) {
                item.classList.add('flex-column');
            }
        });
    } else {
        $('#card-search-results div.card').html(`<div class="d-flex justify-content-center align-items-center p-2" style="height: 45vh;"><span>${getLocalizedString('ui', 'NoResults')}</span></div>`);
        $('#search-pagination > ul').empty();
    }
}

function cardSearchLoadPage(selectedPage = 1, scrollToStart = false) {
    if (currentPage != selectedPage) {
        currentPage = selectedPage;
    }

    var innerHtml = '';
    var count = 0;
    var skipCount = 0;
    var totalPages = Math.ceil(searchedCards.length / searchOptions['perPage']);

    if (totalPages < 0) {
        totalPages = 1;
    }

    if (totalPages > 1 && selectedPage > 1) {
        skipCount = searchOptions['perPage'] * (selectedPage - 1);
    }

    //get all
    $.each(searchedCards, function(key, card) {
        //reduce skip counter
        if (skipCount) {
            skipCount--;
            return;
        }

        innerHtml += generateSearchedCard(card);

        count++;

        if (count == searchOptions['perPage']) {
            return false;
        }
    });

    $('#card-search-results div.card').html(innerHtml);
    cardSearchPagination(searchedCards.length);

    if (scrollToStart) {
        setTimeout(() => {
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }, 100);
    }
}

function generateSearchedCard(card, rarities = []) {
    var cardImage = '';
    var legendBadge = '';
    var cardData = '';
    var cardTypes = '';

    if ('artworks' in card) {
        if (cardSpecialRarities.some(r => searchOptions['filterSelect']['rarities'].includes(r))) {
            if (regionName == 'all') {
                var cardHasRarity = cardSpecialRarities.some(r => card.rarities[setRegions[0]].includes(r));
            } else {
                var cardHasRarity = cardSpecialRarities.some(r => card.rarities[regionName].includes(r));
            }

            var normalImage = '';
            var altImage = '';
            var main_index = card.images.default;

            if (main_index in card.artworks && card.artworks[main_index].normal) {
                if (typeof card.artworks[main_index].normal === 'boolean') {
                    normalImage = `${card.id}_${main_index}.webp`;
                } else {
                    normalImage = card.artworks[main_index].normal;
                }
            }

            if (cardHasRarity) {
                for(let i = cardSpecialRarities.length - 1; i >= 0; i--) {
                    var rarity = cardSpecialRarities[i];
                    var alt_index = card.images[rarity];

                    if (rarity in card.images && card.artworks[alt_index][rarity]) {
                        if (typeof card.artworks[alt_index][rarity] === 'boolean') {
                            altImage = `${card.id}_${alt_index}_${rarity}.webp`;
                        } else {
                            altImage = card.artworks[alt_index][rarity];
                        }

                        break;
                    }
                }
            }

            if (altImage) {
                cardImage = altImage;
            } else {
                cardImage = normalImage;
            }           
        } else {
            var index = card.images.default;

            if (index in card.artworks && card.artworks[index].normal) {
                if (typeof card.artworks[index].normal === 'boolean') {
                    cardImage = `${card.id}_${index}.webp`;
                } else {
                    cardImage = card.artworks[index].normal;
                }
            }

            if (!cardImage && cardSpecialRarities.some(r => r in card.images)) {
                for(let i = cardSpecialRarities.length - 1; i >= 0; i--) {
                    var rarity = cardSpecialRarities[i];
                    var alt_index = card.images[rarity];

                    if (rarity in card.images && card.artworks[alt_index][rarity]) {
                        if (typeof card.artworks[alt_index][rarity] === 'boolean') {
                            cardImage = `${card.id}_${alt_index}_${rarity}.webp`;
                        } else {
                            cardImage = card.artworks[alt_index][rarity];
                        }

                        break;
                    }
                }
            }
        }
    }

    if ('properties' in card && card.properties.includes('LegendCard')) {
        legendBadge = `<span class="badge legend-badge text-dark py-0 ms-1">${getLocalizedString('status', 'Legend')}</span>`;
    }

    if (card.cardType.toLowerCase() == 'monster') {
        //attribute
        cardData = `<div class="d-flex align-items-center pe-1"><img src="images/icons/${card.attribute.toLowerCase()}.png" style="width: 20px; height: 20px;"><span class="ms-1">${getLocalizedCardString('attribute', card.attribute)}</span></div>`;

        //level
        cardData += `<div class="align-self-center px-1"><span>${getLocalizedString('ui', 'Level')} ${card.level}</span></div>`;

        //card types
        cardTypes = `${getLocalizedCardString('race', card.race)} / ${getLocalizedCardString('type', card.type)}`;

        if ('subtype' in card && card.subtype) {
            cardTypes += ` / ${getLocalizedCardString('type', card.subtype)}`;
        }
        
        cardData += `<div class="card-item-data-types align-self-center flex-grow-1 px-1">[ ${cardTypes} ]</span></div>`;

        //atk def maximum atk
        var maximumAtk = '';

        if ('maximumAtk' in card && card.maximumAtk) {
            maximumAtk = `<div class="px-1"><span>MAXIMUM ATK ${card.maximumAtk}</span></div>`;
        }

        cardData += `<div class="card-item-stats d-flex flex-column flex-md-row px-1 pe-0">${maximumAtk}<div class="d-flex"><div class="px-1"><span>ATK ${card.atk}</span></div><div class="ps-1"><span>DEF ${card.def}</span></div></div></div>`;
    } else {
        if (card.type.toLowerCase() != 'normal') {
            cardTypes = `<div class="d-flex align-items-center ps-1"><img src="images/icons/${card.type.toLowerCase()}.png" style="width: 20px; height: 20px;"><span class="ms-1">${getLocalizedCardString('type', card.type)}</span></div>`;
        }

        cardData += `<div class="d-flex align-items-center pe-1"><img src="images/icons/${card.cardType.toLowerCase()}.png" style="width: 20px; height: 20px;"><span class="ms-1">${getLocalizedCardString('cardType', card.cardType)}</span></div>${cardTypes}`;
    }

    //description
    cardData += `</div><div class="card-item-desc">${card.cardText.replace(/\n/g, '<br>')}</div>`;

    var cardRarities = '';

    if (rarities.length) {
        var raritiesIcons = '';

        $.each(rarities, function(key, rarity) {
            raritiesIcons += `<div class="mx-1" style="width: 76px;">${getRarityBadge(rarity)}</div>`;
        });

        cardRarities = `<div class="d-flex justify-content-end py-1 w-100">${raritiesIcons}</div>`;
    }

    return `<div class="card-result-item d-flex flex-wrap align-items-start py-1 px-2" onclick="loadCard(${card.id})"><div class="card-image p-2"><img src="images/cards/${cardImage}"></div><div class="card-item-info d-flex flex-column"><div class="card-item-name py-1"><span>${card.name}${legendBadge}</span></div><div class="card-item-data d-flex flex-wrap flex-md-no-wrap py-1">${cardData}</div></div>${cardRarities}`;
}

function cardSearchPagination(total = 1) {
    var totalPages = Math.ceil(total / searchOptions['perPage']);

    if (totalPages <= 1) {
        $('search-pagination > ul').html('');
        $('#search-pagination').hide();
        return;
    } else {
        $('#search-pagination').show();
    }

    var innerHtml = '';
    var remainingPages = totalPages - currentPage;

    if (currentPage <= 1) {
        innerHtml = `<li class="page-item disabled"><span class="page-link"><span aria-hidden="true">&laquo;</span></span></li>`;
    } else {
        innerHtml = `<li class="page-item"><a href="javascript:;" class="page-link" aria-label="${getLocalizedString('ui', 'Previous')}" onclick="cardSearchLoadPage(${currentPage-1}, true)"><span aria-hidden="true">&laquo;</span></a></li>`;
    }

    if (currentPage > 1) {
        var initialPage = 1;

        if (currentPage > 6) {
            if (remainingPages < 5) {
                initialPage = currentPage - (8 - remainingPages);
            } else {
                initialPage = currentPage - 3;
            }

            if (initialPage < 1) {
                initialPage = 1;
            }

            var additionalPages = currentPage - 4;

            if (additionalPages >= 3 && initialPage > 3) {
                innerHtml += `<li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(1, true)">1</a></li><li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(2, true)">2</a></li><li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (var i = initialPage; i < currentPage; i++) {
            innerHtml += `<li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(${i}, true)">${i}</a></li>`;
        }
    }
    
    innerHtml += `<li class="page-item active"><span class="page-link" aria-current="page">${currentPage}</span></li>`;

    if (currentPage < totalPages) {
        var lastPage = currentPage + 3;
        
        if (currentPage < 7) {
            lastPage = 8;
        } else if (remainingPages <= 5) {
            lastPage = currentPage + remainingPages;
        }

        for (var i = currentPage + 1; i <= lastPage; i++) {
            innerHtml += `<li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(${i}, true)">${i}</a></li>`;

            if (i == totalPages) {
                break;
            }
        }

        if (remainingPages > 5 && (lastPage + 2) < totalPages) {
            innerHtml += `<li class="page-item disabled"><span class="page-link">...</span></li><li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(${totalPages-1}, true)">${totalPages-1}</a></li><li class="page-item"><a href="javascript:;" class="page-link" onclick="cardSearchLoadPage(${totalPages}, true)">${totalPages}</a></li>`;
        }

        innerHtml += `<li class="page-item"><a href="javascript:;" class="page-link" aria-label="${getLocalizedString('ui', 'Next')}" onclick="cardSearchLoadPage(${currentPage+1}, true)"><span aria-hidden="true">&raquo;</span></a></li>`;
    } else {
        innerHtml += `<li class="page-item disabled"><span class="page-link"><span aria-hidden="true">&raquo;</span></span></li>`;
    }

    $('#search-pagination > ul').html(innerHtml);
}

function generateCardTable(container) {
    //1st row
    let innerHtml = `<tr><td width="50%"><div class="d-flex flex-wrap justify-content-between"><span data-translate-string="ui,CardType">${getLocalizedString('ui', 'CardType')}</span><div><img id="card-main-type-icon" src="" class="me-1"><span id="card-main-type-text"></span></div></div></td><td id="card-spell-trap-subtype" width="50%" style="display: none;"><div class="d-flex flex-wrap justify-content-between"><span data-translate-string="ui,Type">${getLocalizedString('ui', 'Type')}</span><div><img id="card-spell-trap-type-icon" src=""><span class="ms-1" id="card-spell-trap-type-text"></span></div></div></td><td id="card-attribute" width="50%" style="display: none;"><div class="d-flex flex-wrap justify-content-between"><span data-translate-string="ui,Attribute">${getLocalizedString('ui', 'Attribute')}</span><div><img id="card-attribute-icon" src=""><span id="card-attribute-text" class="ms-1"></span></div></div></td></tr>`

    //2nd row
    innerHtml += `<tr id="card-monster-types" style="display: none;"><td width="50%"><div class="d-flex justify-content-between"><span data-translate-string="ui,Level">${getLocalizedString('ui', 'Level')}</span><span id="card-level-text"></span></div></td><td width="50%"><div class="d-flex flex-wrap justify-content-between"><span data-translate-string="ui,Types">${getLocalizedString('ui', 'Types')}</span><div id="card-types"><span id="card-race-text"></span><span id="card-type-text"></span><span id="card-subtype-text" style="display: none;"></span></div></div></td></tr>`;

    //3rd row
    innerHtml += '<tr id="card-maximum-atk" style="display: none;"><td colspan="2"><div class="d-flex justify-content-between"><span class="badge rounded-pill text-bg-warning text-light">MAXIMUM ATK</span><span id="card-maximum-atk-text"></span></div></td></tr>';

    //4th row
    innerHtml += '<tr id="card-atk-def"><td width="50%"><div class="d-flex justify-content-between"><span id="card-atk-label" class="badge rounded-pill text-bg-danger">ATK</span><span id="card-atk-text"></span></div></td><td width="50%"><div class="d-flex justify-content-between"><span id="card-def-label" class="badge rounded-pill text-bg-primary">DEF</span><span id="card-def-text"></span></div></td></tr>';

    //5th
    innerHtml += `<tr><td colspan="2"><div class="d-flex"><span data-translate-string="ui,Status">${getLocalizedString('ui', 'Status')}</span>`;

    //add a status for every region available
    $.each(setRegions, function(key, region) {
        innerHtml += `<div id="card-status-${region}"></div>`;
    });

    innerHtml += '</td></tr>';

    //6th row
    innerHtml += '<tr><td id="card-text" colspan="2"></td></tr>';

    $(container).html(innerHtml);
}

let currentCard;

function loadCard(id) {
    if (selectedModule == 'cards') {
        currentCard = find(cardMainList, 'id', id);
        cardTranslation = find(cardList, 'id', id);

        if (!currentCard && !cardTranslation) {
            $('#missing-card').show();
            $('#card-data').hide();
            $('#card-categories').hide();
            $('#card-sets-list').hide();

            resetCardData();
            resetCardRelatedInfo();
            return;
        } else if (currentCard && !cardTranslation) {
            $('#missing-card').show();
            $('#card-data').hide();
        } else {
            renderCardData();
            $('#missing-card').hide();
            $('#card-data').show();
        }

        $('#card-categories').show();
        $('#card-sets-list').show();

        if (!currentCard) {
            currentCard = find(cardList, 'id', id);
        }

        renderCardRelatedInfo();
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    } else {
        loadModule('cards', id);
    }
}

function resetCardData() {
    $('#card-artwork-main').attr('src', '');
    $('#card-artworks-thumbnails').html('');

    $('#card-main-type-icon').attr('src', '');
    $('#card-main-type-text').text('');
    $('#card-text').html('');

    $('#card-spell-trap-type-icon').attr('src', '');
    $('#card-spell-trap-type-text').text('');

    $('#card-attribute-icon').attr('src', '');
    $('#card-attribute-text').text('');

    $('#card-level-text').text('');

    $('#card-race-text').text('');
    $('#card-type-text').text('');
    $('#card-atk-text').text('');
    $('#card-def-text').text('');

    $('#card-subtype-text').hide();
    $('#card-subtype-text').text('');
        
    $('#card-maximum-atk').hide();
    $('#card-maximum-atk-text').text('');
}

function resetCardRelatedInfo() {
    if (regionName == "all") {
        $.each(setRegions, function(key, region) {
            $(`#card-sets-list-${region}`).html('');
        });
    } else {
        $(`#card-sets-list-${regionName}`).html('');
    }

    $.each(cardCategories, function (key, sections) {
        $.each(sections, function(k, category) {
            $(`#card-search-${category.short} > span:not(:first-child)`).remove();
        });
    });
}

function renderCardData() {
    resetCardData();

    //edit card name
    $('#card-name').text(cardTranslation.name);

    //add card artworks
    var orrImages = [];
    var orrBImages = [];

    $.each(cardTranslation.artworks, function(key, artwork) {
        //add normal artwork
        if (artwork.normal) {
            let image = '';

            if (typeof artwork.normal === 'boolean') {
                image = `${cardTranslation.id}_${key}.webp`;
            } else {
                image = artwork.normal;
            }

            $('#card-artworks-thumbnails').append(`<img class="card-thumbnail" src="images/cards/${image}">`);
        }

        //add ORR artwork
        if ('ORR' in artwork && artwork.ORR) {
            if (typeof artwork.ORR === 'boolean') {
                orrImages.push(`${cardTranslation.id}_${key}_ORR.webp`);
            } else {
                orrImages.push(artwork.ORR);
            }
        }

        if ('ORR+B' in artwork && artwork['ORR+B']) {
            if (typeof artwork['ORR+B'] === 'boolean') {
                orrBImages.push(`${cardTranslation.id}_${key}_ORR+B.webp`);
            } else {
                orrBImages.push(artwork.ORR);
            }
        }
    });

    orrImages.forEach(image => {
        $('#card-artworks-thumbnails').append(`<img class="card-thumbnail" src="images/cards/${image}">`);
    });

    orrBImages.forEach(image => {
        $('#card-artworks-thumbnails').append(`<img class="card-thumbnail" src="images/cards/${image}">`);
    });

    if (cardTranslation.artworks.length) {
        $('#card-artwork-main').attr('src', $('#card-artworks-thumbnails :first-child').attr('src'));
        $('#card-artworks-thumbnails :first-child').addClass('active');
    }

    $('#card-artwork-main').on('click', function(e) {
        $('#image-modal').attr('src', e.target.src);
        $('#card-image-modal').modal('show');
    });

    $('#card-artworks-thumbnails > img.card-thumbnail').on('click', function (e) {
        $('.card-thumbnail.active').removeClass('active');
        $('#card-artwork-main').attr('src', e.target.src);
        $(e.target).addClass('active');
    });

    //show legend badge
    if ('properties' in cardTranslation && cardTranslation.properties.includes('LegendCard')) {
        $('#card-legend-status-badge').show();
    } else {
        $('#card-legend-status-badge').hide();
    }

    $('#card-main-type-text').text(getLocalizedCardString('cardType', cardTranslation.cardType));
    $('#card-text').html(cardTranslation.cardText.replace(/\n/g, '<br>'));

    if (cardTranslation.cardType.toLowerCase() == 'monster') {
        $('#card-main-type-icon').hide();
        $('#card-spell-trap-subtype').hide();
        $('#card-attribute').show();
        $('#card-monster-types').show();
        $('#card-atk-def').show();

        $('#card-attribute-icon').attr('src', `images/icons/${cardTranslation.attribute.toLowerCase()}.png`);
        $('#card-attribute-text').text(getLocalizedCardString('attribute', cardTranslation.attribute));

        $('#card-level-text').text(cardTranslation.level);

        $('#card-race-text').text(getLocalizedCardString('race', cardTranslation.race));
        $('#card-type-text').text(getLocalizedCardString('type', cardTranslation.type));
        $('#card-atk-text').text(cardTranslation.atk);
        $('#card-def-text').text(cardTranslation.def);

        if ('subtype' in cardTranslation && cardTranslation.subtype) {
            $('#card-subtype-text').show();
            $('#card-subtype-text').text(getLocalizedCardString('type', cardTranslation.subtype));
        } else {
            $('#card-subtype-text').hide();
        }

        if ('maximumAtk' in cardTranslation && cardTranslation.maximumAtk) {
            $('#card-maximum-atk').show();
            $('#card-maximum-atk-text').text(cardTranslation.maximumAtk);
        } else {
            $('#card-maximum-atk').hide();
        }

        $('#card-spell-trap-type-text').text('');
    } else {
        $('#card-attribute').hide();
        $('#card-monster-types').hide();
        $('#card-atk-def').hide();

        $('#card-main-type-icon').show();
        $('#card-main-type-icon').attr('src', `images/icons/${cardTranslation.cardType.toLowerCase()}.png`);

        if (cardTranslation.type.toLowerCase() != 'normal') {
            $('#card-spell-trap-subtype').show();
            $('#card-spell-trap-type-icon').attr('src', `images/icons/${cardTranslation.type.toLowerCase()}.png`);
            $('#card-spell-trap-type-text').text(getLocalizedCardString('type', cardTranslation.type));
        } else {
            $('#card-spell-trap-subtype').hide();
        }
    }

    //get status in the regions
    if (regionName == "all") {
        $.each(setRegions, function(key, region) {
            if (cardTranslation.status[region]) {
                generateStatusBadge(`#card-status-${region}`, cardTranslation.status[region], getLocalizedString('region', region));
            } else {
                generateStatusBadge(`#card-status-${region}`, 'N/A', getLocalizedString('region', region));
            }
        });

        $('.status-tooltip').tooltip('dispose').tooltip({title: getTooltipTitle, html: true, placement: 'top'});
    } else {
        if (cardTranslation.status[regionName]) {
            generateStatusBadge(`#card-status-${regionName}`, cardTranslation.status[regionName]);
        } else {
            generateStatusBadge(`#card-status-${regionName}`, 'N/A');
        }
    }

    updatePageHistory(`${cardTranslation.name}`, 'card', cardTranslation.id);
}

function renderCardRelatedInfo() {
    resetCardRelatedInfo();

    //generate card sets
    var releases = generateCardSetsLists(currentCard.id);

    if (regionName == "all") {
        var totalSets = 0;

        $.each(setRegions, function(key, region) {
            totalSets += releases[region].length;

            if (releases[region].length) {
                renderCardSet(`#card-sets-list-${region}`, releases[region]);
                $(`#card-sets-${region}`).show();
            } else {
                $(`#card-sets-${region}`).hide();
            }
        });

        if (totalSets) {
            $('#card-sets-list').show();
        } else {
            $('#card-sets-list').hide();
        }
    } else {
        if (releases[regionName].length) {
            renderCardSet(`#card-sets-list-${regionName}`, releases[regionName]);
            $('#card-sets-list').show();
            $(`#card-sets-${regionName}`).show();
        } else {
            $('#card-sets-list').hide();
            $(`#card-sets-${regionName}`).hide();
        }
    }

    $('.rarity-tooltip').tooltip('dispose').tooltip({title: getTooltipTitle, html: true, placement: 'top'});

    //generate related cards
    $.each(cardCategories, function (key, sections) {
        $.each(sections, function(k, category) {
            if (category.type == 2) {
                return;
            }

            var property = toCamelCase(category.name);

            if (property in currentCard && currentCard[property].length) {
                renderSearchCategory(`#card-search-${category.short}`, category, property);
            }
        });
    });

    if ('actions' in currentCard && currentCard.actions.length) {
        $.each(currentCard.actions, function(key, action) {
            if ($(`#card-search-${action.type}`).length) {
                $(`#card-search-${action.type}`).append(`<span class="search-category link-primary" onclick="loadCardFilterAction(${key})">${getLocalizedCardEffect(action.name)}</span>`);
            }
        });
    }

    var totalActions = 0;

    $.each(cardCategories, function (key, sections) {
        var sectionTotal = 0;
        
        $.each(sections, function(k, category) {
            if ($(`#card-search-${category.short} > span:not(:first-child)`).length) {
                sectionTotal++;
                $(`#card-search-${category.short}`).show();
            } else {
                $(`#card-search-${category.short}`).hide();
            }
        });

        if (sectionTotal) {
            if (key) {
                if ($('#card-related').is(':visible')) {
                    $('#card-related').addClass('border-bottom');
                }
                $('#card-search-categories').show();
            } else {
                $('#card-related').show();
            }
        } else {
            if (key) {
                $('#card-related').removeClass('border-bottom');
                $('#card-search-categories').hide();
            } else {
                $('#card-related').hide();
            }
        }
    });
}

function generateCardSetsLists(cardID = null) {
    var releases = {};

    if (regionName == "all") {
        $.each(setRegions, function(key, region) {
            releases[region] = [];
        });
    } else {
        releases[regionName] = [];
    }

    if (!cardID) {
        return releases;
    }

    if (regionName == "all") {
        data.sets.forEach((set) => {
            $.each(setRegions, function(key, region) {
                if (region in set.cardList && (region in set.releaseDate && set.releaseDate[region])) {
                    $.each(set.cardList[region], function(key, card) {
                        if (card.id == cardID) {
                            var index = indexOfArrayObject(releases[region], 'set', set.prefix);

                            if (index >= 0 && releases[region][index].setNumber == card.setNumber) {
                                var rarities = releases[region][index].rarities;

                                $.each(card.rarities, function(k, rarity) {
                                    if (!rarities.includes(rarity)) {
                                        rarities.push(rarity);
                                    }
                                });

                                releases[region][index].rarities = rarities;
                            } else {
                                releases[region].push({
                                    set: set.prefix,
                                    name: set.name,
                                    setNumber: card.setNumber,
                                    date: set.releaseDate[region],
                                    rarities: card.rarities,
                                });
                            }
                        }
                    });
                }
            });
        });

        //sort releases by date
        $.each(setRegions, function(key, region) {
            releases[region].sort((a,b) => new Date(a.date) - new Date(b.date));
        });
    } else {
        data.sets.forEach((set) => {
            if (regionName in set.cardList && (regionName in set.releaseDate && set.releaseDate[regionName])) {
                $.each(set.cardList[regionName], function(key, card) {
                    if (card.id == cardID) {
                        var index = indexOfArrayObject(releases[regionName], 'set', set.prefix);

                        if (index >= 0 && releases[regionName][index].setNumber == card.setNumber) {
                            var rarities = releases[regionName][index].rarities;

                            $.each(card.rarities, function(k, rarity) {
                                if (!rarities.includes(rarity)) {
                                    rarities.push(rarity);
                                }
                            });

                            releases[regionName][index].rarities = rarities;
                        } else {
                            releases[regionName].push({
                                set: set.prefix,
                                name: set.name,
                                setNumber: card.setNumber,
                                date: set.releaseDate[regionName],
                                rarities: card.rarities,
                            });
                        }
                    }
                });
            }
        });

        releases[regionName].sort((a,b) => new Date(a.date) - new Date(b.date));
    }

    return releases;
}

function renderCardSet(container, releases) {
    var innerHtml = '';

    $.each(releases, function(key, set) {
        var rarities = '';

        $.each(set.rarities, function(k, rarity) {
            rarities += getRarityBadge(rarity);
        });

        $(container).append(`<div class="d-flex flex-wrap"><div class="text-md-center"><span>${set.date}</span></div><div class="card-set-prefix text-md-center"><span>${set.setNumber}</span></div><div class="flex-md-grow-1"><span>${set.name}</span></div><div class="card-set-rarities text-center offset-lg-2 offset-md-0">${rarities}</div></div>`);
    });
}

function renderSearchCategory(container, category, property) {
    var categories = [];

    $.each(currentCard[property], function(key, value) {
        var name = value;
        var action = '';

        switch(category.type) {
            case 1:
                name = createStringFromFilter(value);
                
                if (!name) {
                    return
                }

                action = `loadCardFilter('${property}', ${key})`;
                break;

            case 3:
                action = `loadCardFilter('${property}', ${key})`;
                name = getLocalizedString(property, value);
                break;

            default:
                var searchCard = findCardIsReleased(value);
                action = `loadCard(${value})`;

                if (searchCard) {
                    name = searchCard.name;
                } else {
                    return;
                }
        }

        categories.push({
            action: action,
            name: name,
        })
    });

    if (category.sort) {
        categories.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    $.each(categories, function(key, category) {
        $(container).append(`<span class="search-category link-primary" onclick="${category.action}">${category.name}</span>`);
    });
}

function getFormatString(group, string, optionalGroup = null) {
    if ((userLang == 'Es' && optionalGroup != 'cardType') || (userLang != 'Es' && optionalGroup == 'cardType')) {
        if (optionalGroup) {
            return `${getLocalizedString('effectString', group)} ${getLocalizedString(optionalGroup, string)}`;
        } else {
            return `${getLocalizedString('effectString', group)} ${getLocalizedString(group, string)}`;
        }
    } else {
        if (optionalGroup) {
            return `${getLocalizedString(optionalGroup, string)} ${getLocalizedString('effectString', group)}`;
        } else {
            return `${getLocalizedString(group, string)} ${getLocalizedString('effectString', group)}`;
        }
    }
}

function createStringFromFilter(filter) {
    var keywords = [];
    var string = '';

    var cardType = 'cardType' in filter ? filter.cardType : '';

    if (cardType.toLowerCase() == 'monster') {
        if ('levels' in filter && filter.levels) {
            keywords[0] = `${getLocalizedString('effectString', 'level')} ${filter.levels[0]}`;

            switch(filter.levels[1]) {
                case '>=':
                    keywords[0] += ` ${getLocalizedString('effectString', 'orHigher')}`;
                    break;

                case '<=':
                    keywords[0] += ` ${getLocalizedString('effectString', 'orLower')}`;
                    break;

                case '||':
                    keywords[0] += ` ${getLocalizedString('effectConjuction', 'or')} ${filter.levels[2]}`;
                    break;

                case '-':
                    keywords[0] += `-${filter.levels[2]}`;
                    break;

                case '!=':
                    keywords[0] = `${getLocalizedString('effectConjuction', 'non')}${keywords[0]}`;
                    break;

                default:
                    break;
            }
        }

        if ('attributes' in filter && filter.attributes) {
            keywords[1] = '';

            if (filter.attributes.length == 1) {
                keywords[1] += getFormatString('attribute', filter.attributes[0]);
            } else {
                var totalAttributes = filter.attributes.length;

                if (userLang == 'Es') {
                    $.each(filter.attributes, function(key, attribute) {
                        if (key == 0) {
                            keywords[1] += getFormatString('attribute', attribute);
                        } else if (key < (totalAttributes - 1)) {
                            keywords[1] += ', ';
                            keywords[1] += getLocalizedString('attribute', attribute);
                        } else {
                            keywords[1] += ' o ';
                            keywords[1] += getLocalizedString('attribute', attribute);
                        }
                    });
                } else {
                    $.each(filter.attributes, function(key, attribute) {
                        if (key == (totalAttributes - 1)) {
                            keywords[1] += ' or ';
                            keywords[1] += getFormatString('attribute', attribute);
                        } else {
                            if (keywords[1] != '') {
                                keywords[1] += ', ';
                            }
                            keywords[1] += getLocalizedString('attribute', attribute);
                        }
                    });
                }
            }
        } else if ('exclude' in filter && 'attributes' in filter.exclude) {
            keywords[1] = `${getLocalizedString('effectConjuction', 'non')}`;

            if (filter.exclude.attributes.length == 1) {
                keywords[1] += getFormatString('attribute', filter.exclude.attributes[0]);
            } else {
                var totalAttributes = filter.exclude.attributes.length;

                if (userLang == 'Es') {
                    $.each(filter.exclude.attributes, function(key, attribute) {
                        if (key == 0) {
                            keywords[1] += getFormatString('attribute', attribute);
                        } else if (key < (totalAttributes - 1)) {
                            keywords[1] += ', ';
                            keywords[1] += getLocalizedString('attribute', attribute);
                        } else {
                            keywords[1] += ' o ';
                            keywords[1] += getLocalizedString('attribute', attribute);
                        }
                    });
                } else {
                    $.each(filter.exclude.attributes, function(key, attribute) {
                        if (key == (totalAttributes - 1)) {
                            keywords[1] += ' or ';
                            keywords[1] += getFormatString('attribute', attribute);
                        } else {
                            if (keywords[1] != '') {
                                keywords[1] += ', ';
                            }
                            keywords[1] += getLocalizedString('attribute', attribute);
                        }
                    });
                }
            }
        }

        if ('races' in filter && filter.races) {
            keywords[2] = '';

            if (filter.races.length == 1) {
                keywords[2] += getFormatString('race', filter.races[0]);
            } else {
                var totalRaces = filter.races.length;

                if (userLang == 'Es') {
                    $.each(filter.races, function(key, race) {
                        if (key == 0) {
                            keywords[2] += getFormatString('race', race);
                        } else if (key < (totalRaces - 1)) {
                            keywords[2] += ', ';
                            keywords[2] += getLocalizedString('race', race);
                        } else {
                            keywords[2] += ' o ';
                            keywords[2] += getLocalizedString('race', race);
                        }
                    });
                } else {
                    $.each(filter.races, function(key, race) {
                        if (key == (totalRaces - 1)) {
                            keywords[2] += ' or ';
                            keywords[2] += getFormatString('race', race);
                        } else {
                            if (keywords[2] != '') {
                                keywords[2] += ', ';
                            }
                            keywords[2] += getLocalizedString('race', race);
                        }
                    });
                }
            }
        }

        //monster type
        keywords[3] = '';

        if (userLang == 'Es') {
            if ('type' in filter && filter.type) {
                keywords[3] += `${getLocalizedString('cardTypeShort', 'Monster')} ${getLocalizedString('effectString', toCamelCase(filter.type))}`;
            } else {
                keywords[3] = getLocalizedString('cardTypeShort', 'Monster');
            }

            if ('subtype' in filter && filter.subtype) {
                keywords[3] += ` ${getLocalizedString('effectString', toCamelCase(filter.subtype))}`;
            }
        } else {
            if ('subtype' in filter && filter.subtype) {
                keywords[3] = `${getLocalizedString('type', filter.subtype)} `;
            }

            if ('type' in filter && filter.type) {
                keywords[3] += `${getLocalizedString('type', filter.type)} ${getLocalizedString('cardTypeShort', 'Monster')}`;
            } else {
                if (keywords[0] != null || keywords[1] != null || keywords[2] != null) {
                    keywords[3] = getLocalizedString('cardTypeShort', 'Monster').toLowerCase();
                } else {
                    keywords[3] = getLocalizedString('cardTypeShort', 'Monster');
                }
            }
        }

        if ('atk' in filter && !isNaN(filter.atk[0])) {
            keywords[5] = `${getLocalizedString('effectConjuction', 'with')} ${filter.atk[0]}`;

            if (userLang != 'Es' && filter.atk[2]) {
                keywords[5] += ` ${getLocalizedString('effectString', 'original')}`;
            }

            switch(filter.atk[1]) {
                case '>=':
                    if (userLang == 'Es') {
                        keywords[5] += ` ATK ${getLocalizedString('effectString', 'orMore')}`;
                    } else {
                        keywords[5] += ` ${getLocalizedString('effectString', 'orMore')} ATK`;
                    }
                    break;

                case '<=':
                    if (userLang == 'Es') {
                        keywords[5] += ` ATK ${getLocalizedString('effectString', 'orLess')}`;
                    } else {
                        keywords[5] += ` ${getLocalizedString('effectString', 'orLess')} ATK`;
                    }
                    break;

                case '!=':
                    keywords.splice(5, 1);
                    keywords[7] = `${getLocalizedString('effectConjuction', 'exceptMonsters')} ${filter.atk[0]} ATK`;
                    break;

                default:
                    keywords[5] += ' ATK';

                    if (userLang == 'Es' && filter.atk[2]) {
                        keywords[5] += ` ${getLocalizedString('effectString', 'original')}`;
                    }
                    break;
            }
        }

        if ('def' in filter && !isNaN(filter.def[0])) {
            if (keywords[5]) {
                keywords[6] = `${getLocalizedString('effectConjuction', 'and')} ${filter.def[0]}`;
            } else {
                keywords[6] = `${getLocalizedString('effectConjuction', 'with')} ${filter.def[0]}`;
            }

            if (userLang != 'Es' && filter.def[2]) {
                keywords[6] += ` ${getLocalizedString('effectString', 'original')}`;
            }

            switch(filter.def[1]) {
                case '>=':
                    if (userLang == 'Es') {
                        keywords[6] += ` DEF ${getLocalizedString('effectString', 'orMore')}`;
                    } else {
                        keywords[6] += ` ${getLocalizedString('effectString', 'orMore')} DEF`;
                    }
                    break;

                case '<=':
                    if (userLang == 'Es') {
                        keywords[6] += ` DEF ${getLocalizedString('effectString', 'orLess')}`;
                    } else {
                        keywords[6] += ` ${getLocalizedString('effectString', 'orLess')} DEF`;
                    }
                    break;

                case '!=':
                    keywords.splice(6, 1);
                    keywords[8] = '';

                    if (keywords[7]) {
                        keywords[8] += `${getLocalizedString('effectConjuction', 'exceptMonsters')}`;
                    } else {
                        keywords[8] += `${getLocalizedString('effectConjuction', 'and')}`;
                    }

                    keywords[8] = ` ${filter.def[0]}`;
                    break;

                default:
                    keywords[6] += ' DEF';

                    if (userLang == 'Es' && filter.def[2]) {
                        keywords[6] += ` ${getLocalizedString('effectString', 'original')}`;
                    }
                    break;
            }
        }
    } else if (cardType.toLowerCase() == 'spell') {
        if ('type' in filter) {
            keywords[3] = getFormatString(filter.type.toLowerCase(), filter.cardType, 'cardType');
        } else {
            keywords[3] = getLocalizedString('cardType', 'Spell');
        }
    } else if (cardType.toLowerCase() == 'trap') {
        keywords[3] = getLocalizedString('cardType', 'Trap');
    }

    if ('id' in filter && filter.id) {
        var filterCard = findCardIsReleased(filter.id);

        if (filterCard) {
            keywords[3] = `"${filterCard.name}"`;
        }
    }

    if (userLang == 'Es') {
        for(var i = 4; i >= 0; i--) {
            if (!keywords[i]) {
                continue;
            }

            if (i != keywords.length && string.length > 0) {
                string += ' ';
            }

            string += keywords[i];
        }

        for(var i = 5; i < 9; i++) {
            if (!keywords[i]) {
                continue;
            }

            if (i != keywords.length && string.length > 0) {
                string += ' ';
            }

            string += keywords[i];
        }
    } else {
        $.each(keywords, function(key, keyword) {
            if (!keyword) {
                return;
            }

            if (key && string.length > 0) {
                string += ' ';
            }

            string += keyword;
        });
    }

    return string;
}

function loadCardFilter(property, index) {
    var filter = currentCard[property][index];

    if (!filter) {
        return;
    }

    searchResetFilter(false);

    currentPage = 1;

    if (property === 'series' || property === 'properties') {
        searchOptions['filterSelect'][property].push(filter);

        loadModule('cardsList');
        return;
    }

    if ('id' in filter && filter.id) {
        var filterCard = findCardIsReleased(filter.id);

        if (filterCard) {
            searchOptions['filterText']['search'].text = `ID:${filterCard.id}`;
        }
    }

    if ('cardType' in filter) {
        searchOptions['filter']['cardType'][filter.cardType] = true;
    }

    if ('levels' in filter && filter.levels) {
        if (filter.levels[1] === '!=') {
            searchOptions['filterButton']['level'][filter.levels[0]] = 2;
        } else {
            searchOptions['filterButton']['level'][filter.levels[0]] = 1;
        }

        switch(filter.levels[1]) {
            case '>=':
                for(let i = filter.levels[0] + 1; i < 13; i++) {
                    searchOptions['filterButton']['level'][i] = 1;
                }
                break;

            case '<=':
                for(let i = filter.levels[0] - 1; i > 0; i--) {
                    searchOptions['filterButton']['level'][i] = 1;
                }
                break;

            case '||':
                searchOptions['filterButton']['level'][filter.levels[2]] = 1;
                break;

            case '-':
                for(let i = filter.levels[0] + 1; i <= filter.levels[2]; i++) {
                    searchOptions['filterButton']['level'][i] = 1;
                }
                break;

            default:
                break;
        }
    }

    if ('attributes' in filter && filter.attributes) {
        filter.attributes.forEach(attribute => {
            searchOptions['filterButton']['attribute'][attribute] = 1;
        });
    }

    if ('races' in filter && filter.races) {
        filter.races.forEach(race => {
            searchOptions['filterButton']['race'][race] = 1;
        });
    }

    if ('subtype' in filter && filter.subtype) {
        if (filter.subtype == 'NonEffect') {
            searchOptions['filterButton']['type'].Effect = 2;
        } else {
            searchOptions['filterButton']['type'][filter.subtype] = 1;
        }
    }

    if ('type' in filter && filter.type) {
        if (filter.type == 'NonEffect') {
            searchOptions['filterButton']['type'].Effect = 2;
        } else {
            searchOptions['filterButton']['type'][filter.type] = 1;
        }
    }

    if ('exclude' in filter && filter.exclude) {
        if ('attributes' in filter.exclude) {
            filter.exclude.attributes.forEach(attribute => {
                searchOptions['filterButton']['attribute'][attribute] = 2;
            });
        }

        if ('types' in filter.exclude) {
            if (filter.exclude.types.includes('ExtraDeck')) {
                var index = filter.exclude.types.indexOf('ExtraDeck');
                filter.exclude.types.splice(index, 1);

                extraDeckCards.forEach(type => {
                    filter.exclude.types.push(type);
                });
            }

            filter.exclude.types.forEach(type => {
                searchOptions['filterButton']['type'][type] = 2;
            });
        }
    }

    if (('type' in filter && filter.type) || ('subtype' in filter && filter.subtype) || ('exclude' in  filter && filter.exclude)) {
        typeRadio = 'all';
    }

    if ('atk' in filter && !isNaN(filter.atk[0])) {
        switch(filter.atk[1]) {
            case '>=':
                searchOptions['filterText']['ATK'].min = parseInt(filter.atk[0]);
                break;

            case '<=':
                searchOptions['filterText']['ATK'].max = parseInt(filter.atk[0]);
                break;

            case '!=':
                searchOptions['filterText']['ATK'].exclude = parseInt(filter.atk[0]);
                break;

            default:
                searchOptions['filterText']['ATK'].min = parseInt(filter.atk[0]);
                searchOptions['filterText']['ATK'].max = parseInt(filter.atk[0]);
                break;
        }
    }

    if ('def' in filter && !isNaN(filter.def[0])) {
        switch(filter.def[1]) {
            case '>=':
                searchOptions['filterText']['DEF'].min = parseInt(filter.def[0]);
                break;

            case '<=':
                searchOptions['filterText']['DEF'].max = parseInt(filter.def[0]);
                break;

            case '!=':
                searchOptions['filterText']['DEF'].exclude = parseInt(filter.def[0]);
                break;

            default:
                searchOptions['filterText']['DEF'].min = parseInt(filter.def[0]);
                searchOptions['filterText']['DEF'].max = parseInt(filter.def[0]);
                break;
        }
    }

    loadModule('cardsList');
}

function loadCardFilterAction(index) {
    var filter = currentCard.actions[index];

    if (!filter) {
        return;
    }

    var effect = data.effects.find((c) => c.abbreviation == filter.name);

    if (!effect) {
        return;
    }

    searchOptions['filterEffectSelect'][effect.type].push(filter.name);

    loadModule('cardsList');
}

function generateStatusBadge(container, status, region = null) {
    let badge = '';
    let popupTitle = region ? `data-bs-title="${region}"` : '';

    switch(status) {
        case 0:
            badge = `<span class="badge rounded-pill text-bg-danger ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', Forbidden)}</span></div>`;
            break;

        case 1:
            badge = `<span class="badge rounded-pill text-bg-warning ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Limited')}</span></div>`;
            break;

        case 2:
            badge = `<span class="badge rounded-pill text-bg-warning-2 ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'SemiLimited')}</span></div>`;
            break;

        case 3:
            badge = `<span class="badge rounded-pill text-bg-success ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Unlimited')}</span></div>`;
            break;

        case "legend":
            badge = `<span class="badge legend-badge text-dark">${getLocalizedString('status', 'Legend')}</span>`;
            break;

        case "l1":
            badge = `<span class="badge rounded-pill text-bg-info text-light ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Limited1')}</span></div>`;
            break;

        case "l2":
            badge = `<span class="badge rounded-pill text-bg-info-2 ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Limited2')}</span></div>`;
            break;

        case "l3":
            badge = `<span class="badge rounded-pill text-bg-info-3 ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Limited3')}</span></div>`;
            break;

        default:
            badge = `<span class="badge rounded-pill text-bg-secondary ms-2 status-tooltip" ${popupTitle}>${getLocalizedString('status', 'Unreleased')}</span></div>`;
            break;
    }

    $(container).html(badge);
}

function getRarityBadge(abbreviation) {
    var index = data.rarities.findIndex(x => x.abbreviation == abbreviation);

    if (index >= 0) {
        var rarity = {
            abbreviation: data.rarities[index].abbreviation,
            name: data.rarities[index].name,
            color: data.rarities[index].color,
        };

        var specialType = abbreviation.split('+');

        if (specialType.length > 1 && specialType[0] != 'P') {
            rarity.abbreviation = specialType[0];

            switch (specialType[1]) {
                case "DL":
                    switch (specialType[0]) {
                        case "UR":
                            rarity.name = "Ultra Rare";
                            break;

                        case "SR":
                            rarity.name = "Super Rare";
                            break;

                        case "R":
                            rarity.name = "Rare";
                            break;

                        case "N":
                        default:
                            rarity.name = "Normal";
                            break;
                    }
                    break;

                case "R":
                    rarity.color += `; border: 2px solid #bf0505; padding-top: 0.2em; padding-bottom: 0.2em`;
                    break;

                case "B":
                    rarity.color += `; border: 2px solid #151515; padding-top: 0.2em; padding-bottom: 0.2em`;
                    break;

                case "Bl":
                    rarity.color += `; border: 2px solid #0c8fdd; padding-top: 0.2em; padding-bottom: 0.2em`;
                    break;
            }
        }

        return `<span class="badge text-light w-100 rarity-tooltip d-flex d-lg-block justify-content-center" style="background: ${rarity.color};" data-bs-title="${rarity.name}"><p class="align-self-center mb-0">${rarity.abbreviation}</p><span>${rarity.name}</span></span>`;
    } else {
        return '';
    }
}

function getTooltipTitle() {
    return this.attributes['data-bs-title'] ? this.attributes['data-bs-title'].nodeValue : 'Not Available';
}

function loadLanguage(lang) {
    $('*[data-translate-string]').each(function (i,el) {
        if (!$(el).data('translate-string')) {
            return;
        }

        let [key, value] = $(el).data('translate-string').split(',');

        $(el).html(getLocalizedString(key, value));
    });

    $('*[data-translate-title]').each(function (i,el) {
        if (!$(el).data('translate-title')) {
            return;
        }

        let [key, value] = $(el).data('translate-title').split(',');

        $(el).attr('title', getLocalizedString(key, value));
    });

    //update text
    $('#navbar-card-language-selector span').text($(`#navbar-card-language-selector-${cardLang.toLowerCase()} span`).text());
    $('#navbar-region-selector span').text(getLocalizedString('setRegion', regionName));
}

function changeLanguage(lang) {
    if (lang != userLang && languages.includes(lang)) {
        json_list = getLanguageJSONList(lang.toLowerCase());

        loadJSON(json_list, result => {
            data = Object.assign(data, result);
        }).then(function(val) {
            generateSortedMainCardsList();

            $(`#navbar-language-selector-${userLang.toLowerCase()}`).removeClass('active');

            userLang = lang;
            localStorage.setItem('language', lang);

            $('#navbar-language-selector span').text($(`#navbar-language-selector-${userLang.toLowerCase()} span`).text());
            $(`#navbar-language-selector-${userLang.toLowerCase()}`).addClass('active');

            loadModule(selectedModule);
        }, function(reason) {
            console.error(reason);
        });
    }
}

function changeCardLanguage(lang) {
    if (lang != cardLang && cardLanguages.hasOwnProperty(lang)) {
        json_card_list = getCardJSONList(lang.toLowerCase());

        loadJSON(json_card_list, result => {
            data = Object.assign(data, result);
        }).then(function(val) {
            generateSortedCardsList();            
            generateCardSearchFilters(false);

            $(`#navbar-card-language-selector-${cardLang.toLowerCase()}`).removeClass('active');

            cardLang = lang;
            localStorage.setItem('cardLanguage', lang);

            $('#navbar-card-language-selector span').text($(`#navbar-card-language-selector-${cardLang.toLowerCase()} span`).text());
            $(`#navbar-card-language-selector-${cardLang.toLowerCase()}`).addClass('active');

            loadModule(selectedModule);
        }, function(reason) {
            console.error(reason);
        });
    }
}

function changeRegion(region) {
    if (region != regionName && (setRegions.includes(region) || regionName != 'all')) {
        if (!setRegions.includes(region)) {
            region = 'all';
        }

        $(`#navbar-region-selector-${regionName}`).removeClass('active');

        regionName = region;
        localStorage.setItem('region', region);

        $('#navbar-region-selector span').text($(`#navbar-region-selector-${regionName} span`).text());
        $(`#navbar-region-selector-${regionName}`).addClass('active');

        generateCardSearchFilters();

        loadModule(selectedModule);
    }
}

function updatePageHistory(pageTitle, searchParamKey, searchParamValue) {    
    var url = new URL(window.location.href)

    if (url.searchParams.get(searchParamKey) != searchParamValue) {
        url.searchParams.forEach((v,k) => url.searchParams.delete(k));
        url.searchParams.set(searchParamKey, searchParamValue);
        history.pushState(null, '', url);
    }

    $('title').html(`${pageTitle} | Rush Duel DB`);
    $('#navbar-content').collapse('hide');
}
