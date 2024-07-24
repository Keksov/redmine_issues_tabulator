
module RedmineIssuesTabulator
    module Hooks
        class Hooks < Redmine::Hook::ViewListener
        
            #**
            # view_layouts_base_html_head
            def view_layouts_base_html_head( aContext )
                #puts( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', aContext[ 'fullpath' ] )
                #stylesheet_link_tag( 'tabulator/tabulator.min.css', plugin: 'redmine_issues_tabulator' ) + 
                stylesheet_link_tag( 'tabulator/semantic-ui/tabulator_semantic-ui.min.css', plugin: 'redmine_issues_tabulator' ) + 
                javascript_include_tag( 'tabulator/tabulator.min.js', plugin: 'redmine_issues_tabulator' )
            end
            
            #***
            # view_issues_index_bottom
            def view_issues_index_bottom( aContext )
                javascript_include_tag( 'issues_tabulator.js', plugin: 'redmine_issues_tabulator' )            
            end
        end
  end
end
