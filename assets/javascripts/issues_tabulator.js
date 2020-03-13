/* 
Redmine Issues Tabulator plugin
Author Keks Keksov, 2020
GNU License

Visit http://www.tabulator.info/ for docs and full sources of Tabulator widget
*/

( function() {
    let config = {
        // Selector for RM issues table element as defined in app/views/issues/_list.html.erb
        // e.g. <table class="list issues odd-even <%= query.css_classes %>">
        tableClassesSelector : '.list.issues',
        // Add tabulator's setup options here (see http://www.tabulator.info/docs/4.5/options)
        tabulatorOptions : { 
            headerSort : false,
            layout : 'fitDataFill',
            persistence : {
                columns : [ 'width' ]
            }
        }
    }
    
    // Textarea formatter should display HTML properly
    Tabulator.prototype.moduleBindings.format.prototype.formatters.textarea = function( cell, formatterParams, onRendered ) {
		cell.getElement().style.whiteSpace = "pre-wrap";
        return this.emptyToSpace( cell.getValue() );
	}
        
    // First, we create a fake table to get access to Row.prototype.createElement function
    // We have to override it with our own function
    let fakeTableElement = document.createElement( 'table' );
    fakeTableElement.classList.add( 'fake_table' );
    fakeTableElement.innerHTML = '<tr><td>fake</td></tr>';
    document.body.appendChild( fakeTableElement );  
    let fakeTable = new Tabulator( 'table.fake_table' );
    let row_create_element_without_redmine = fakeTable.rowManager.rows[0].__proto__.createElement;
    
    fakeTable.rowManager.rows[0].__proto__.createElement = function() {
        rowElement = row_create_element_without_redmine();
        // this line of code required for RM context menu to work properly
        rowElement.classList.add( 'hascontextmenu' ); 
        return rowElement;
    }
    fakeTableElement.remove();
    document.querySelector( 'div.fake_table.tabulator' ).remove();
    
    // Infecting table headers with tabulator related settings. Search columns.js for Column.prototype.defaultOptionList to get all possible settings you may put here
	let headers = document.body.querySelectorAll( 'table' + config.tableClassesSelector + ' > thead > tr > th' );
    for( let i = 0, n = headers.length; i < n; i++ ) {
        header = headers[i];
        //console.log( header );
        //console.log( $(header).width() );
        
        headers[i].setAttribute( 'tabulator-formatter', 'html' ); // keep HTML in table cells as rendered by RM
        header.setAttribute( 'tabulator-title', header.innerHTML ); // as well as in column titles
        
        let isCheckbox = ( i == 0 );
        /*let isColumnWithDefaultWidth = isCheckbox || !header.classList.contains( 'subject' );
        
        if ( isColumnWithDefaultWidth ) {
            // Let's set default width for the column so it'll not grow
            console.log( header.className + ' ' + $(header).width() );
            header.setAttribute( 'tabulator-width', $(header).width() + ( isCheckbox ? 0 : 25 ) );    
        }*/
        
        if ( isCheckbox )  {
            // set field name for the first column without title
            header.setAttribute( 'tabulator-field', 'checkbox' ); 
            continue;
        }
        
        if ( header.classList.contains( 'buttons' ) )  {
            // same for the last column with three dots
            header.setAttribute( 'tabulator-field', 'buttons' );
            header.setAttribute( 'tabulator-title', ' ' );
            // let's stick this column to the right side of our table
            //header.setAttribute( 'tabulator-frozen', true );
            continue;
        }
    
        if ( header.classList.contains( 'subject' ) )  {
            // Show subject without clipping
            header.setAttribute( 'tabulator-variableHeight', true );
            header.setAttribute( 'tabulator-formatter', 'textarea' );
            continue;
        }
    
        //console.log( header );
    }
    //table.rowManager.rows[0].__proto__.createElement
    //let table = new Tabulator( 'table.list.issues', { headerSort : false, layout : 'fitDataFill', persistence : false } );
    // Creating tabulator object on top of our vanilla HTML table. All data from it will be imported automagically (see modules/html_table_import.js)
    let table = new Tabulator( 'table' + config.tableClassesSelector, config.tabulatorOptions );
    //console.log( table );
    // fixing horizontal scroll bar problem
    $( 'div' + config.tableClassesSelector ).width( '99.5%' ); 
    
    // (re)enabling (un)check all check box 
    $( 'input[type=checkbox].toggle-selection' ).on( 'change', toggleIssuesSelection );
    function toggleIssuesSelection(el) {
        let checked = $(this).prop( 'checked' );
        let boxes = $(this).parents( 'div.list.issues' ).find( 'input[name=ids\\[\\]]' );
        
        boxes.prop( 'checked', checked ).parents( '.hascontextmenu' ).toggleClass( 'context-menu-selection', checked );
        checked ? table.selectRow( 'all' ) : table.deselectRow();
    }
    
    console.log( 'Issues tabulator was here' )
    
    //$("#download-xlsx").click(function(){
    //table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
} )();