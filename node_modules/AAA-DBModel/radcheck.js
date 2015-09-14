/**
 * Created by Achintha on 6/25/15.
 */
module.exports = function(sequelize, DataTypes) {
    var radcheck = sequelize.define('radcheck', {
            id:{type : DataTypes.INTEGER, unique: true},
            username: DataTypes.STRING,
            attribute: DataTypes.STRING,
            op:DataTypes.STRING,
            value:DataTypes.STRING

        },
        {
            freezeTableName: true,
            tablename: 'radcheck'
        }
    );


    return radcheck;
};
