export const UserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING(100),
        defaultValue : ''
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate : {
        //   msg : 'le nom ne peut etre null'
        // }
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
          notNull : {msg : 'le prenom ne peut etre null'}
        }
      },
      birthDate: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue : 0
      },
      sexe : {
        type : DataTypes.CHAR(5),
        allowNull : false,
        defaultValue : 'M',
        set(sexe){
          this.setDataValue('sexe',sexe.toUpperCase())
        }
      },
      online : {
        type : DataTypes.INTEGER(1),
        defaultValue : 0,
        allowNull : false
      },
      localisation : {
        type : DataTypes.STRING(50),
        defaultValue : 'Ouest CAMEROUN - Dschang',
        allowNull : false
      },
      completedActivities : {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue('completedActivities') ? this.getDataValue('completedActivities').split(',').map(a=>parseInt(a)) : null
        },
        set(completedActivities){
          let anciene = this.get('completedActivities') //ici ancienne est un atbleau ou null
          let nouvelle 
          console.log('ancienne valeur : ' , anciene)
          if(anciene){
            //ici anciene est un tableau
            nouvelle = [...anciene.map(a => parseInt(a))]
            nouvelle.push(parseInt(completedActivities))
          }else{
            nouvelle = [completedActivities]
          }
          console.log('nouvelle valeur : ',nouvelle )
           this.setDataValue('completedActivities' , nouvelle.join(',') )
        },
      },completedChapters : {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue('completedChapters') ? this.getDataValue('completedChapters').split(',').map(a=>parseInt(a)) : null
        },
        set(completedChapters){
          let anciene = this.get('completedChapters') //ici ancienne est un atbleau ou null
          let nouvelle 
          console.log('ancienne valeur : ' , anciene)
          if(anciene){
            //ici anciene est un tableau
            nouvelle = [...anciene.map(a => parseInt(a))]
            nouvelle.push(parseInt(completedChapters))
          }else{
            nouvelle = [completedChapters]
          }
          console.log('nouvelle valeur : ',nouvelle )
           this.setDataValue('completedChapters' , nouvelle.join(',') )
        },
      },completedThemes : {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue('completedThemes') ? this.getDataValue('completedThemes').split(',').map(a=>parseInt(a)) : null
        },
        set(completedThemes){
          let anciene = this.get('completedThemes') //ici ancienne est un atbleau ou null
          let nouvelle 
          console.log('ancienne valeur : ' , anciene)
          if(anciene){
            //ici anciene est un tableau
            nouvelle = [...anciene.map(a => parseInt(a))]
            nouvelle.push(parseInt(completedThemes))
          }else{
            nouvelle = [completedThemes]
          }
          console.log('nouvelle valeur : ',nouvelle )
           this.setDataValue('completedThemes' , nouvelle.join(',') )
        },
      },
      lastSeen : {
        type: DataTypes.STRING,
        defaultValue : '[0,0,0,0,0]',
        get() {
          return this.getDataValue('lastSeen') ? this.getDataValue('lastSeen').split(',').map(a=>parseInt(a)) : null
        },
        set(lastSeen){
          let anciene = this.get('lastSeen') //ici ancienne est un atbleau ou null
          let nouvelle 
          console.log('ancienne valeur : ' , anciene)
          if(anciene){
            //ici anciene est un tableau
            nouvelle = [...anciene.map(a => parseInt(a))]
            nouvelle.push(parseInt(lastSeen))
            nouvelle.shift()
          }else{
            nouvelle = [lastSeen]
          }
          console.log('nouvelle valeur : ',nouvelle )
           this.setDataValue('lastSeen' , nouvelle.join(',') )
        },
      },
      examenHistory : {
        type : DataTypes.STRING,
        defaultValue : '"[]"', 

        /* ca sera un tableau de la forme 
        [
          {
            examenId : 1,
            note : 0 ~ 1
          }
        ]
        */
        get() {
          return this.getDataValue('examenHistory') ? JSON.parse(this.getDataValue('examenHistory')): []
        },
        set(examenHistory /* ceci est un objet du type {
          examenId : 1,
          note : 0~1
        }*/){
          let anciene = this.get('examenHistory') //ici ancienne est un atbleau ou null
          let nouvelle = 0
          console.log('ancienne valeur : ' , anciene)
          nouvelle = anciene.filter(examen => examen.examenId === examenHistory.examenId)[0]
          if(anciene){
            if(nouvelle){
              nouvelle.note = examenHistory.note
            }else{
              nouvelle = anciene.push(examenHistory)
            }
          }else{
            nouvelle = [examenHistory]
          }
          console.log('nouvelle valeur : ',nouvelle )
           this.setDataValue('examenHistory' , JSON.stringify(nouvelle) )
        }
        
      }
    },
    {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      indexes : [
        {
          fields : ['email'],
          unique :true
        }
      ],
      onDelete: 'CASCADE',
    }
  );
};
