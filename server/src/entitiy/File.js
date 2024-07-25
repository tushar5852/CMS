const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "File",
  tableName: "files",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    type: {
      type: "varchar",
    },
    order: {
      type: "int",
      nullable: true,
    },
  },
});
