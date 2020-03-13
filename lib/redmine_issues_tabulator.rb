
Rails.configuration.to_prepare do
    require_dependency 'redmine_issues_tabulator/hooks/hooks'
end 