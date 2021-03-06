define(["underscore"], function(_){
	var remoteFunctions = {
		buildScatterPlotData : function(optionsJson){
			var startTime = new Date().getTime();
			var options = JSON.parse(optionsJson);
			var parseTime = new Date().getTime();
			var resultSetToPatientMap = function(resultSet){
				var patientRows = [];
				_.each(resultSet.data, function(patient){
					var patientValues = {};
					_.each(patient, function(value){
						_.extend(patientValues, value);						
					});
					patientRows.push(patientValues);					
				});
				return _.indexBy(patientRows, "PATIENT_NUM");
			};

			var xPatientMap = resultSetToPatientMap(options.resultSets.x);
			var yPatientMap = resultSetToPatientMap(options.resultSets.y);
			var mappedTime = new Date().getTime();

			var results = {};

			_.each(_.keys(xPatientMap), function(patientNum){
				var patientValues = _.extend({}, xPatientMap[patientNum], yPatientMap[patientNum]);
				var patientRow = {
						patientId : patientValues["PATIENT_NUM"],
						x : Math.round(patientValues[options.scriptOptions["x-axis"]]),
						y : Math.round(patientValues[options.scriptOptions["y-axis"]])
				};
				if(patientRow.y != null){
					if(results[patientRow.x] === undefined){
						results[patientRow.x] = {};
					}
					if(results[patientRow.x][patientRow.y] === undefined){
						results[patientRow.x][patientRow.y] = 0;
					}
					results[patientRow.x][patientRow.y]++;
				}
			});
			resultsArray = [];
			_.each(_.keys(results), function(x){
				_.each(_.keys(results[x]), function(y){
					resultsArray.push({
						count : results[x][y],
						x : x,
						y : y
					});
				});
			});
			
			var resultsTime = new Date().getTime();
			
			return {
				timings :{
					timeParsing : parseTime - startTime,
					timeMapping : mappedTime - parseTime,
					timeCompilingResults : resultsTime - mappedTime,
					totalTime : resultsTime - startTime
				},
				data : resultsArray
			};
		}
	};
	return remoteFunctions;
});