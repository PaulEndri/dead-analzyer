export default
	[
		// Stage 1
		{
			$match: {
			    "name": {
			      $in: [
			      
			      ]
			    }
			}
		},

		// Stage 2
		{
			$match: {
			    weapons: {$exists:true}
			}
		},

		// Stage 3
		{
			$group: {
			    "_id": {
			         "name": "$name",
			         "id": "$accountId"
			    },
			    "kills" : {$sum: "$kills"},
			    "games": {$sum: 1},
			    "weapons": {
			      $push: "$weapons"
			    },
			    "cqc": {$sum:  "$ranges.cqc"},
			    "short": {$sum:  "$ranges.short"},
			    "medium": {$sum:  "$ranges.medium"},
			    "long": {$sum:  "$ranges.long"}
			}
		},

		// Stage 4
		{
			$unwind: "$weapons"
		},

		// Stage 5
		{
			$unwind: "$weapons"
		},

		// Stage 6
		{
			$group: {
			    _id: {
			        id: "$_id.name",
			        weapon: "$weapons.name"
			    },
			    usage: { $sum: "$weapons.usage" },
			    totalKills: {$first: "$kills"},
			    totalGames: {$first: "$games"},
			    cqc: {$first: "$cqc"},
			    short: {$first: "$short"},
			    medium: {$first: "$medium"},
			    long: {$first: "$long"},
			    hits: {$sum: "$weapons.hit" },
			    kills: {$sum: "$weapons.kills"},
			    damage: { $sum: "$weapons.damage"},
			    headshots: {$sum: "$weapons.location.headshot"}
			}
		},

		// Stage 7
		{
			$project: {
			    "_id": "$_id",
			    "usage": 1,
			    "hits": 1,
			    "totalKills": 1, 
			    "kills": 1,
			    "damage": 1,
			    "totalGames": 1,
			    "ranges": {
			     	"cqc": "$cqc",
			     	"short": "$short",
			     	"medium": "$medium",
			     	"long": "$long"
			    },
			    "accuracy": {
			         $divide: ["$hits", {$cond: {
			           if: { $lte: ["$usage", 0] }, then: 1, else: "$usage"  
			         }}]
			    },
			    "averageDamage": {
			         $divide: ["$damage", {$cond: {
			           if: { $lte: ["$hits", 0] }, then: 1, else: "$hits"  
			         }}]
			    },
			    "headshotRate" : {
			         $divide: ["$headshots", {$cond: {
			           if: { $lte: ["$hits", 0] }, then: 1, else: "$hits"  
			         }}]
			    },
			
			    
			}
		},

		// Stage 8
		{
			$sort: {
			    "kills": -1
			}
		},

		// Stage 9
		{
			$group: {
			    _id: "$_id.id",
			    kills: {$first: "$totalKills"}, 
			    games: {$first: "$totalGames"},
			    ranges: {$first: "$ranges"},
			    data: {
			      $push: {
			           Weapon: "$_id.weapon",
			           Usage: "$usage",
			           Hits: "$hits",
			           Kills: "$kills",
			           Damage: "$damage",
			           Accuracy: "$accuracy",
			           Average_Damage: "$averageDamage"
			      }
			    }
			    
			}
		},

	]
