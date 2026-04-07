class YourAnswer {
  database;

  constructor(database) {
    this.database = database;
    this.prepare();
    const foreignKeyOnSentence = `PRAGMA foreign_keys = ON;`;
    this.database.run(foreignKeyOnSentence);
  }

  prepare() {
    throw new Error('オーバーライド必須です。');
  }
}

export class YourAnswer02 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    this.database.run(createSentence);
  }
}

export class YourAnswer03 extends YourAnswer02 {
  constructor(database) {
    super(database);
  }
}

export class YourAnswer04 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '桐の棒', 1200, 10),
      (null, '鉄の斧', 16000, 8);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer05 extends YourAnswer04 {
  constructor(database) {
    super(database);
  }
}

export class YourAnswer06 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '桐の棒', 1200, 10),
      (null, '金の斧', 2000000, 8);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer07 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '金の斧', 2000000, 8),
      (null, 'ぬか杖', 1000, 20),
      (null, '祝福の杖', 3000000, 1),
      (null, 'i本', 180000, 5),
      (null, '壺', 1000000, 2);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer08 extends YourAnswer07 {
  constructor(database) {
    super(database);
  }
}

export class YourAnswer09 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '金の斧', 2000000, 8),
      (null, 'ぬか杖', 1000, 20),
      (null, '祝福の杖', 3000000, 1),
      (null, 'i本', 180000, 5),
      (null, '壺', 1000000, 2),
      (null, '鋼のハリセン', 15000, 8),
      (null, 'エクスカリパー', 1000, 25),
      (null, 'バールのようなもの', 5000, 6),
      (null, '包丁', 12000, 8),
      (null, '箒', 500, 13),
      (null, '藁人形', 1000, 3),
      (null, '手裏剣', 35000, 20),
      (null, '毒針', 100, 5),
      (null, '源氏の草鞋', 20000, 2),
      (null, '冷凍バナナ', 200, 5);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer10 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER NOT NULL,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`spell_id\` INTEGER NOT NULL,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL,
      PRIMARY KEY (\`material_id\`, \`spell_id\`)
    );`;
    const insertSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000, 1, 'ファイア', 5, 1, '火', '雷'),
      (2, 'スタンガン', 6500, 2, 'サンダー', 8, 2, '雷', '水'),
      (3, 'ガソリン', 3000, '1,3', 'ファイア,メガファイア', '5,10', '1,1', '火,火', '雷,雷'),
      (4, '水鉄砲', 300, 4, 'ウォーター', 2, 3, '水', '火'),
      (5, '焼夷弾', 12000000, 5, 'テラファイア', 258, 1, '火', '雷'),
      (6, 'ポリタンク', 2000, 3, 'メガファイア', 10, 1, '火', '雷');`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer11 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER NOT NULL,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`spell_id\` INTEGER NOT NULL,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL,
      PRIMARY KEY (\`material_id\`, \`spell_id\`)
    );`;
    const insertSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000, 1, 'ファイア', 5, 1, '火', '雷');`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer12 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createMaterialsSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL
    );`;
    const createSpellsSentence = `CREATE TABLE \`spells\` (
      \`spell_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL
    );`;
    const createMaterialSpellsSentence = `CREATE TABLE \`material_spells\` (
      \`material_id\` INTEGER NOT NULL,
      \`spell_id\` INTEGER NOT NULL,
      PRIMARY KEY (\`material_id\`, \`spell_id\`),
      FOREIGN KEY (\`material_id\`) REFERENCES \`materials\`(\`material_id\`),
      FOREIGN KEY (\`spell_id\`) REFERENCES \`spells\`(\`spell_id\`)
    );`;
    const insertMaterialsSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000),
      (2, 'スタンガン', 6500),
      (4, '水鉄砲', 300),
      (5, '焼夷弾', 12000000),
      (6, 'ポリタンク', 2000),
      (3, 'ガソリン', 3000);`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1, '火', '雷'),
      (2, 'サンダー', 8, 2, '雷', '水'),
      (4, 'ウォーター', 2, 3, '水', '火'),
      (5, 'テラファイア', 258, 1, '火', '雷'),
      (3, 'メガファイア', 10, 1, '火', '雷');`;
    const insertMaterialSpellsSentence = `INSERT INTO \`material_spells\`
      VALUES
      (1, 1),
      (2, 2),
      (4, 4),
      (5, 5),
      (6, 3),
      (3, 1),
      (3, 3);`;
    this.database.run(createMaterialsSentence);
    this.database.run(createSpellsSentence);
    this.database.run(createMaterialSpellsSentence);
    this.database.run(insertMaterialsSentence);
    this.database.run(insertSpellsSentence);
    this.database.run(insertMaterialSpellsSentence);
  }
}

export class YourAnswer13 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSpellsSentence = `CREATE TABLE \`spells\` (
      \`spell_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL
    );`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1, '火', '雷');`;
    this.database.run(createSpellsSentence);
    this.database.run(insertSpellsSentence);
  }
}

export class YourAnswer14 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createMaterialsSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL
    );`;
    const createElementsSentence = `CREATE TABLE \`elements\` (
      \`element_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL
    );`;
    const createSpellsSentence = `CREATE TABLE \`spells\` (
      \`spell_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL REFERENCES \`elements\`(\`element_id\`)
    );`;
    const createMaterialSpellsSentence = `CREATE TABLE \`material_spells\` (
      \`material_id\` INTEGER NOT NULL,
      \`spell_id\` INTEGER NOT NULL,
      PRIMARY KEY (\`material_id\`, \`spell_id\`),
      FOREIGN KEY (\`material_id\`) REFERENCES \`materials\`(\`material_id\`),
      FOREIGN KEY (\`spell_id\`) REFERENCES \`spells\`(\`spell_id\`)
    );`;
    this.database.run(createMaterialsSentence);
    this.database.run(createElementsSentence);
    this.database.run(createSpellsSentence);
    this.database.run(createMaterialSpellsSentence);
    const insertMaterialsSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000),
      (2, 'スタンガン', 6500),
      (4, '水鉄砲', 300),
      (5, '焼夷弾', 12000000),
      (6, 'ポリタンク', 2000),
      (3, 'ガソリン', 3000);`;
    const insertElementsSentence = `INSERT INTO \`elements\`
      VALUES
      (1, '火', '雷'),
      (2, '雷', '水'),
      (3, '水', '火');`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1),
      (2, 'サンダー', 8, 2),
      (4, 'ウォーター', 2, 3),
      (5, 'テラファイア', 258, 1),
      (3, 'メガファイア', 10, 1);`;
    const insertMaterialSpellsSentence = `INSERT INTO \`material_spells\`
      VALUES
      (1, 1),
      (2, 2),
      (4, 4),
      (5, 5),
      (6, 3),
      (3, 1),
      (3, 3);`;
    this.database.run(insertMaterialsSentence);
    this.database.run(insertElementsSentence);
    this.database.run(insertSpellsSentence);
    this.database.run(insertMaterialSpellsSentence);
  }
}

export class YourAnswer15 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createElementsSentence = `CREATE TABLE \`elements\` (
      \`element_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL
    );`;
    this.database.run(createElementsSentence);
    const insertElementsSentence = `INSERT INTO \`elements\`
      VALUES
      (1, '火', '雷'),
      (2, '雷', '水'),
      (3, '水', '火');`;
    this.database.run(insertElementsSentence);
  }
}

export class YourAnswer16 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createElementsSentence = `CREATE TABLE \`elements\` (
      \`element_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`element_name\` TEXT NOT NULL,
      \`strong_against_element_id\` INTEGER NOT NULL,
      FOREIGN KEY (\`strong_against_element_id\`)
        REFERENCES \`elements\`(\`element_id\`)
    );`;
    this.database.run(createElementsSentence);
    const insertElementsSentence = `INSERT INTO \`elements\`
      VALUES
      (1, '火', 2),
      (2, '雷', 3),
      (3, '水', 1);`;
    this.database.run(insertElementsSentence);
  }
}

export class YourAnswer17 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '金の斧', 2000000, 8),
      (null, 'ぬか杖', 1000, 20),
      (null, '祝福の杖', 3000000, 1),
      (null, 'i本', 180000, 5),
      (null, '壺', 1000000, 2),
      (null, '鋼のハリセン', 15000, 8),
      (null, 'エクスカリパー', 1000, 25),
      (null, 'バールのようなもの', 5000, 6),
      (null, '包丁', 12000, 8),
      (null, '箒', 500, 13),
      (null, '藁人形', 1000, 3),
      (null, '手裏剣', 35000, 20),
      (null, '毒針', 100, 5),
      (null, '源氏の草鞋', 20000, 2),
      (null, '冷凍バナナ', 200, 5);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer18 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createMaterialsSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const createElementsSentence = `CREATE TABLE \`elements\` (
      \`element_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`element_name\` TEXT NOT NULL,
      \`strong_against_element_id\` INTEGER NOT NULL,
      FOREIGN KEY (\`strong_against_element_id\`) REFERENCES \`elements\`(\`element_id\`)
    );`;
    const createSpellsSentence = `CREATE TABLE \`spells\` (
      \`spell_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL REFERENCES \`elements\`(\`element_id\`)
    );`;
    const createMaterialSpellsSentence = `CREATE TABLE \`material_spells\` (
      \`material_id\` INTEGER NOT NULL,
      \`spell_id\` INTEGER NOT NULL,
      PRIMARY KEY (\`material_id\`, \`spell_id\`),
      FOREIGN KEY (\`material_id\`) REFERENCES \`materials\`(\`material_id\`),
      FOREIGN KEY (\`spell_id\`) REFERENCES \`spells\`(\`spell_id\`)
    );`;
    const createViewSentence = `CREATE VIEW material_spell_elements_view AS
      SELECT \`material_name\`, \`price\`, \`stock_quantity\`,
        \`spell_name\`, \`mp_cost\`,
        \`e1\`.\`element_name\`,
        \`e2\`.\`element_name\` AS \`strong_against\`
      FROM \`material_spells\`
      JOIN \`materials\`
        ON \`material_spells\`.\`material_id\` = \`materials\`.\`material_id\`
      JOIN \`spells\`
        ON \`material_spells\`.\`spell_id\` = \`spells\`.\`spell_id\`
      JOIN \`elements\` AS \`e1\`
        ON \`spells\`.\`element_id\` = \`e1\`.\`element_id\`
      JOIN \`elements\` AS \`e2\`
        ON \`e1\`.\`strong_against_element_id\` = \`e2\`.\`element_id\`;`
    this.database.run(createMaterialsSentence);
    this.database.run(createElementsSentence);
    this.database.run(createSpellsSentence);
    this.database.run(createMaterialSpellsSentence);
    this.database.run(createViewSentence);
    const insertMaterialsSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000, 5),
      (2, 'スタンガン', 6500, 15),
      (4, '水鉄砲', 300, 13),
      (5, '焼夷弾', 12000000, 2),
      (6, 'ポリタンク', 2000, 6),
      (3, 'ガソリン', 3000, 20);`;
    const insertElementsSentence = `INSERT INTO \`elements\`
      VALUES
      (1, '火', 2),
      (2, '雷', 3),
      (3, '水', 1);`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1),
      (2, 'サンダー', 8, 2),
      (4, 'ウォーター', 2, 3),
      (5, 'テラファイア', 258, 1),
      (3, 'メガファイア', 10, 1);`;
    const insertMaterialSpellsSentence = `INSERT INTO \`material_spells\`
      VALUES
      (1, 1),
      (2, 2),
      (4, 4),
      (5, 5),
      (6, 3),
      (3, 1),
      (3, 3);`;
    this.database.run(insertMaterialsSentence);
    this.database.run(insertElementsSentence);
    this.database.run(insertSpellsSentence);
    this.database.run(insertMaterialSpellsSentence);
  }
}

export class YourAnswer19 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '金の斧', 2000000, 8),
      (null, 'ぬか杖', 1000, 20),
      (null, '祝福の杖', 3000000, 1),
      (null, 'i本', 180000, 5),
      (null, '壺', 1000000, 2),
      (null, '鋼のハリセン', 15000, 8),
      (null, 'エクスカリパー', 1000, 25),
      (null, 'バールのようなもの', 5000, 6),
      (null, '包丁', 12000, 8),
      (null, '箒', 500, 13),
      (null, '藁人形', 1000, 3),
      (null, '手裏剣', 35000, 20),
      (null, '毒針', 100, 5),
      (null, '源氏の草鞋', 20000, 2),
      (null, '冷凍バナナ', 200, 5);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

export class YourAnswer20 extends YourAnswer {
  constructor(database) {
    super(database);
  }

  prepare() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const insertSentence = `INSERT INTO \`products\`
      VALUES
      (null, '金の斧', 2000000, 8),
      (null, 'ぬか杖', 1000, 20),
      (null, '祝福の杖', 3000000, 1),
      (null, 'i本', 180000, 2),
      (null, '壺', 1000000, 1),
      (null, '鋼のハリセン', 15000, 8),
      (null, 'エクスカリパー', 1000, 25),
      (null, 'バールのようなもの', 5000, 6),
      (null, '包丁', 12000, 8),
      (null, '箒', 500, 13),
      (null, '藁人形', 1000, 3),
      (null, '手裏剣', 35000, 20),
      (null, '毒針', 100, 5),
      (null, '源氏の草鞋', 20000, 2),
      (null, '冷凍バナナ', 200, 5);`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
  }
}

