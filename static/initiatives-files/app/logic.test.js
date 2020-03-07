function testSortTags1() {
    const result = [
        'is-grassroots',
        'goal-fight-fossil',
        'goal-conservation',
        'use-civil-disobedience',
        'use-protests',
        'l-de',
        'knowledge-reveal-links-between-industry-and-politics',
        'target-government',
        'target-companies',
        'is-ngo',
        'support-connect-activists-or-initiatives',
    ].sort(exports.logic.sortTags).join();
    if(result !== [
            'is-grassroots',
            'is-ngo',
            'goal-conservation',
            'goal-fight-fossil',
            'use-civil-disobedience',
            'use-protests',
            'support-connect-activists-or-initiatives',
            'l-de',
            'knowledge-reveal-links-between-industry-and-politics',
            'target-companies',
            'target-government',
        ].join()) {
        throw new Error('Invalid order: ' + result);
    }
}
function testSortTags2() {
    const result = [
        'good-new-norms-and-values',
        'is-grassroots',
        'use-civil-disobedience',
        'use-protests',
        'support-connect-activists-or-initiatives',
        'support-train-activists',
        'l-global',
        'is-ngo',
        'target-government',
    ].sort(exports.logic.sortTags).join();
    if(result !== [
            'good-new-norms-and-values',
            'is-grassroots',
            'is-ngo',
            'use-civil-disobedience',
            'use-protests',
            'support-connect-activists-or-initiatives',
            'support-train-activists',
            'l-global',
            'target-government',
        ].join()) {
        throw new Error('Invalid order: ' + result);
    }
}

testSortTags1();
testSortTags2();