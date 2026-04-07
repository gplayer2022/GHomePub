class ModelAnswer {
  database;
  responses;

  constructor(database) {
    this.database = database;
    const foreignKeyOnSentence = `PRAGMA foreign_keys = ON;`;
    this.database.run(foreignKeyOnSentence);
  }

  isSameResult(modelResponses, yourResponses) {
    let isSame = false;
    if (modelResponses.length === yourResponses.length) {
      isSame = modelResponses.every((modelResponse, i) => {
        return JSON.stringify(modelResponse.columns) === JSON.stringify(yourResponses[i].columns) &&
          JSON.stringify(modelResponse.values) === JSON.stringify(yourResponses[i].values);
      });
    }
    return isSame;
  }

  // オーバライド用疑似抽象メソッド
  checkAnswer(yourDatabase) {
    throw new Error('子クラスでの要実装');
  }

  checkAnswerByResponses(yourResponses) {
    return this.isSameResult(this.responses, yourResponses);
  }
}

export class ModelAnswer01 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.#evaluate();
  }

  #evaluate() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    const tableInfoSentence = `PRAGMA table_info(products);`;
    this.database.run(createSentence);
    this.responses = this.database.exec(tableInfoSentence);
  }

  checkAnswer(yourDatabase) {
    let isCorrect = false;
    try {
      const yourResponses = yourDatabase.exec(`PRAGMA table_info(\`products\`);`);
      isCorrect = super.isSameResult(this.responses, yourResponses);
      return isCorrect;
    } catch (error) {
      console.log(`エラー : ${error}`);
      return false;
    }
  }
}

export class ModelAnswer02 extends ModelAnswer01 {
  constructor(database) {
    super(database);
  }
}

export class ModelAnswer03 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.#evaluate();
  }

  #evaluate() {
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
    const selectSentence = `SELECT * FROM \`products\` ORDER BY \`id\`;`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
    this.responses = this.database.exec(selectSentence);
  }

  checkAnswer(yourDatabase) {
    let isCorrect = false;
    try {
      const yourResponses = yourDatabase.exec(`SELECT * FROM \`products\` ORDER BY \`id\`;`);
      isCorrect = super.isSameResult(this.responses, yourResponses);
    } catch (error) {
      console.log(`設問 3 のエラー : ${error}`);
    } finally {
      return isCorrect;
    }
  }
}

export class ModelAnswer04 extends ModelAnswer03 {
  constructor(database) {
    super(database);
  }
}

export class ModelAnswer05 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.#evaluate();
  }

  #evaluate() {
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
    const selectSentence = `SELECT * FROM \`products\` ORDER BY \`id\`;`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer06 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.#evaluate();
  }

  #evaluate() {
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
    const deleteSentence = `DELETE FROM \`products\`
      WHERE \`id\`=1;`;
    const selectSentence = `SELECT * FROM \`products\`;`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
    this.database.run(deleteSentence);
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer07 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.seed();
    this.evaluate();
  }

  seed() {
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

  evaluate() {
    const selectSentence = `SELECT * FROM \`products\` 
      WHERE \`product_name\` LIKE '%杖%';`;
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer08 extends ModelAnswer07 {
  constructor(database) {
    super(database);
  }

  evaluate() {
    const selectSentence = `SELECT * FROM \`products\` 
      WHERE \`product_name\` LIKE '%杖%'
      ORDER BY \`price\` DESC;`;
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer09 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.seed();
    this.evaluate();
  }

  seed() {
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

  evaluate() {
    const selectSentence = `SELECT * FROM \`products\` 
      LIMIT 5 OFFSET 10;`;
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer10 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.seed();
    this.evaluate();
  }

  seed() {
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
    const deleteSentence = `DELETE FROM \`materials\` WHERE \`material_id\`=3;`;
    const reinsertSentence = `INSERT INTO \`materials\`
      VALUES
      (3, 'ガソリン', 3000, 1, 'ファイア', 5, 1, '火', '雷'),
      (3, 'ガソリン', 3000, 3, 'メガファイア', 10, 1, '火', '雷');`;
    this.database.run(createSentence);
    this.database.run(insertSentence);
    this.database.run(deleteSentence);
    this.database.run(reinsertSentence);
  }

  evaluate() {
    const selectSentence = `SELECT material_name, price, spell_name FROM \`materials\`;`;
    this.responses = this.database.exec(selectSentence);
  }
}

export class ModelAnswer11 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
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
    this.database.run(createMaterialsSentence);
    this.database.run(createSpellsSentence);
    this.database.run(createMaterialSpellsSentence);
  }

  evaluate() {
    const insertMaterialsSentence = `INSERT INTO \`materials\`
      VALUES
      (1, '火炎瓶', 1000);`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1, '火', '雷');`;
    const insertMaterialSpellsSentence = `INSERT INTO \`material_spells\`
      VALUES
      (1, 1);`;
    this.database.run(insertMaterialsSentence);
    this.database.run(insertSpellsSentence);
    this.database.run(insertMaterialSpellsSentence);
    const pragmaMaterialsSentence = `PRAGMA table_info(\`materials\`);`;
    const pragmaSpellsSentence = `PRAGMA table_info(\`spells\`);`;
    const pragmaMaterialSpellsSentence = `PRAGMA table_info(\`material_spells\`);`;
    const selectMaterialsSentence = `SELECT * FROM \`materials\`;`;
    const selectSpellsSentence = `SELECT * FROM \`spells\`;`;
    const selectMaterialSpellsSentence = `SELECT * FROM \`material_spells\`;`;
    const sqls = `${pragmaMaterialsSentence}
      ${pragmaSpellsSentence}
      ${pragmaMaterialSpellsSentence}
      ${selectMaterialsSentence}
      ${selectSpellsSentence}
      ${selectMaterialSpellsSentence}`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer12 extends ModelAnswer11 {
  constructor(database) {
    super(database);
  }

  evaluate() {
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
    this.database.run(insertMaterialsSentence);
    this.database.run(insertSpellsSentence);
    this.database.run(insertMaterialSpellsSentence);
    const sqls = `SELECT material_name, price, spell_name
      FROM material_spells
      JOIN materials ON material_spells.material_id=materials.material_id
      JOIN spells ON material_spells.spell_id=spells.spell_id
      ORDER BY price DESC LIMIT 3`;
    this.responses = this.database.exec(sqls);
  }
}


export class ModelAnswer13 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
    const createElementsSentence = `CREATE TABLE \`elements\` (
      \`element_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`element_name\` TEXT NOT NULL,
      \`strong_against\` TEXT NOT NULL
    );`;
    const createSpellsSentence = `CREATE TABLE \`spells\` (
      \`spell_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`spell_name\` TEXT NOT NULL,
      \`mp_cost\` INTEGER NOT NULL,
      \`element_id\` INTEGER NOT NULL,
      FOREIGN KEY (\`spell_id\`) REFERENCES \`spells\`(\`spell_id\`)
    );`;
    this.database.run(createElementsSentence);
    this.database.run(createSpellsSentence);
  }

  evaluate() {
    const insertElementsSentence = `INSERT INTO \`elements\`
      VALUES
      (1, '火', '雷');`;
    const insertSpellsSentence = `INSERT INTO \`spells\`
      VALUES
      (1, 'ファイア', 5, 1);`;
    this.database.run(insertElementsSentence);
    this.database.run(insertSpellsSentence);
    const pragmaElementsSentence = `PRAGMA table_info(\`elements\`);`;
    const pragmaSpellsSentence = `PRAGMA table_info(\`spells\`);`;
    const selectElementsSentence = `SELECT * FROM \`elements\`;`;
    const selectSpellsSentence = `SELECT * FROM \`spells\`;`;
    const sqls = pragmaElementsSentence + pragmaSpellsSentence + selectElementsSentence + selectSpellsSentence;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer14 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
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
  }

  evaluate() {
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
    const sqls = `SELECT material_name, spell_name, mp_cost, element_name
      FROM material_spells
      JOIN materials ON material_spells.material_id=materials.material_id
      JOIN spells ON material_spells.spell_id=spells.spell_id
      JOIN elements ON spells.element_id=elements.element_id
      ORDER BY mp_cost
      LIMIT 3 OFFSET 2;`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer15 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
    const createElementsSentence = `CREATE TABLE elements (
      element_id INTEGER PRIMARY KEY AUTOINCREMENT,
      element_name TEXT NOT NULL,
      strong_against_element_id INTEGER NOT NULL,
      FOREIGN KEY (strong_against_element_id)
        REFERENCES elements(element_id)
    );`;
    this.database.run(createElementsSentence);
  }

  evaluate() {
    // 外部キー自己参照のため一時的に OFF に
    const foreignKeyOffSentence = `PRAGMA foreign_keys = OFF;`;
    const foreignKeySententce = `PRAGMA foreign_keys;`;
    const insertElementsSentence = `INSERT INTO elements
      VALUES
      (1, '火', 2),
      (2, '雷', 3),
      (3, '水', 1);`;
    const selectElementsSentence = `SELECT * FROM elements;`
    const sql = `${foreignKeySententce}
      ${foreignKeyOffSentence}
      ${foreignKeySententce}
      ${insertElementsSentence}
      ${selectElementsSentence}`;
    this.responses = this.database.exec(sql);
  }
}

export class ModelAnswer16 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
    const createElementsSentence = `CREATE TABLE elements (
      element_id INTEGER PRIMARY KEY AUTOINCREMENT,
      element_name TEXT NOT NULL,
      strong_against_element_id INTEGER NOT NULL,
      FOREIGN KEY (strong_against_element_id)
        REFERENCES elements(element_id)
    );`;
    this.database.run(createElementsSentence);
  }

  evaluate() {
    const insertElementsSentence = `INSERT INTO elements
      VALUES
      (1, '火', 2),
      (2, '雷', 3),
      (3, '水', 1);`;
    this.database.run(insertElementsSentence);
    const sqls = `SELECT
        e1.element_id, e1.element_name, e2.element_name AS strong_against
      FROM elements AS e1
      JOIN elements AS e2 ON e1.strong_against_element_id=e2.element_id;`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer17 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
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

  evaluate() {
    const sqls = `SELECT SUM(price*stock_quantity) AS total_price
      FROM products`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer18 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
    const createMaterialsSentence = `CREATE TABLE \`materials\` (
      \`material_id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`material_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` NOT NULL
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
  }

  evaluate() {
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
    const sqls = `SELECT element_name, SUM(price*stock_quantity) AS total_price
      FROM material_spell_elements_view
      GROUP BY element_name`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer19 extends ModelAnswer {
  constructor(database) {
    super(database);
    this.setup();
    this.evaluate();
  }

  setup() {
    const createSentence = `CREATE TABLE \`products\` (
      \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
      \`product_name\` TEXT NOT NULL,
      \`price\` INTEGER NOT NULL,
      \`stock_quantity\` INTEGER NOT NULL
    );`;
    this.database.run(createSentence);
  }

  evaluate() {
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
    this.database.run(insertSentence);
    const sqls = `SELECT product_name, price FROM products
      WHERE price>=(SELECT AVG(price) FROM products)`;
    this.responses = this.database.exec(sqls);
  }
}

export class ModelAnswer20 extends ModelAnswer19 {
  constructor(database) {
    super(database);
  }

  evaluate() {
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
    this.database.run(insertSentence);
    const sqls = `SELECT product_name, price,
      CASE
        WHEN price>=1000000 THEN '上品なお嬢様向け高級品'
        WHEN price>=10000 THEN '庶民向け中級品'
        ELSE '貧乏人向けお買い得品'
      END AS tag
      FROM products`;
    this.responses = this.database.exec(sqls);
  }
}
