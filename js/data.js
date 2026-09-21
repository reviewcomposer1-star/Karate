window.KarateData = {
    categories: {
        geri: { id: 'geri', kanji: '蹴り', name: 'Geri', subtitle: 'Kicks & Leg Strikes' },
        zuki: { id: 'zuki', kanji: '突き', name: 'Zuki', subtitle: 'Punches & Direct Strikes' },
        uke: { id: 'uke', kanji: '受け', name: 'Uke', subtitle: 'Blocks & Defenses' },
        dachi: { id: 'dachi', kanji: '立ち', name: 'Dachi', subtitle: 'Stances & Postures' }
    },
    allTechniques: [],
    register: function(techList) {
        this.allTechniques.push(...techList);
    },
    getTechnique(id) {
        return this.allTechniques.find(t => t.id === id);
    }
};
