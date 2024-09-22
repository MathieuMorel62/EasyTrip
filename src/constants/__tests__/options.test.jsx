import { SelectTravelesList, SelectBudgetOptions, AI_PROMPT } from '../options';
import { test, expect } from '@jest/globals';


test('vérifie la structure de SelectTravelesList', () => {
  // Vérifier le nombre d'options de voyageurs
  expect(SelectTravelesList.length).toBe(4);

  // Vérifier les propriétés de chaque objet
  SelectTravelesList.forEach(option => {
    expect(option).toHaveProperty('id');
    expect(option).toHaveProperty('title');
    expect(option).toHaveProperty('desc');
    expect(option).toHaveProperty('icon');
    expect(option).toHaveProperty('people');
  });

  // Vérifier le contenu d'une option spécifique
  expect(SelectTravelesList[0]).toEqual({
    id: 1,
    title: 'Seul(e)',
    desc: 'Voyage en solo pour explorer',
    icon: '✈️',
    people: '1 personne'
  });
});

test('vérifie la structure de SelectBudgetOptions', () => {
  // Vérifier le nombre d'options de budget
  expect(SelectBudgetOptions.length).toBe(3);

  // Vérifier les propriétés de chaque objet
  SelectBudgetOptions.forEach(option => {
    expect(option).toHaveProperty('id');
    expect(option).toHaveProperty('title');
    expect(option).toHaveProperty('desc');
    expect(option).toHaveProperty('icon');
  });

  // Vérifier le contenu d'une option spécifique
  expect(SelectBudgetOptions[1]).toEqual({
    id: 2,
    title: 'Modéré',
    desc: 'Gardez un budget moyen',
    icon: '💰'
  });
});

test('vérifie la présence des balises de remplacement dans AI_PROMPT', () => {
  // Vérifier que le prompt contient les balises de remplacement nécessaires
  expect(AI_PROMPT).toContain('{location}');
  expect(AI_PROMPT).toContain('{totalDays}');
  expect(AI_PROMPT).toContain('{traveler}');
  expect(AI_PROMPT).toContain('{budget}');
  expect(AI_PROMPT).toContain('hotelOptions');
  expect(AI_PROMPT).toContain('itinerary');
  expect(AI_PROMPT).toContain('Jour {dayNumber}');
  expect(AI_PROMPT).toContain('lunch break');
  expect(AI_PROMPT).toContain('dinner reservation');
});

test('vérifie que toutes les descriptions de SelectTravelesList sont non vides', () => {
  SelectTravelesList.forEach(option => {
    expect(option.desc).not.toBe('');
  });
});

test('vérifie que toutes les icônes de SelectBudgetOptions sont valides', () => {
  SelectBudgetOptions.forEach(option => {
    // Vérifie que chaque icône est un emoji ou une chaîne de texte appropriée
    expect(option.icon).toMatch(/[\u{1F300}-\u{1F5FF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}|\u{1FB00}-\u{1FBFF}|\u{1F004}]/u);
  });
});
