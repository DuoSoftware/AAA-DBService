/**
 * Created by Achintha on 6/25/15.
 */
module.exports = function(sequelize, DataTypes) {
    var radusergroup = sequelize.define('radusergroup', {
            username: DataTypes.STRING,
            groupname: DataTypes.STRING,
            priority: DataTypes.INTEGER,

        },
        {
            freezeTableName: true,
            tablename: 'radusergroup'
        }
    );

    return radusergroup;
};
