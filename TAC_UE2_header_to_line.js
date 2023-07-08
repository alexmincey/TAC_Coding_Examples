/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

//Created By: Alex Mincey
//Company: TAC Solutions Group

define(['N/record', 'N/runtime', 'N/search'],
/**
 * @param {email} email
 * @param {error} error
 * @param {file} file
 * @param {format} format
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 * @param {task} task
 */
function(record, runtime, search) {
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
        //Get the Internal ID
        var recID = scriptContext.newRecord.id;

        // Re-load the Sales Order
        var salesOrderRec = record.load({
            type: 'record.Type.SALES_ORDER',
            id: recID
        });
        
        //Value from the Header of the Sales Order
        var FieldValue = salesOrderRec.getValue({
            fieldId: 'department'
        });

        if (FieldValue) {
            //Get the Number of Lines in Sublist 
            var sublistLineCount = salesOrderRec.getLineCount({
                sublistId: 'item'
            });

            //Loop Throught Each Sublist Line
            for (var x = 0; x < sublistLineCount; x++) {
                salesOrderRec.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'department',
                    line: x,
                    value: FieldValue
                });
            }
        }
        //Save the Sales Order
        var salesOrderID = salesOrderRec.save({
            enableSourcing: true,
            ignoreManditoryFields: true
        })

        log.debug('Saved Sales Order', salesOrderID)
    }
    return {
        afterSubmit: afterSubmit
    };
    
});
