library(ggplot2)
library(plyr)
library(lubridate)

# Files
gitRoot <- "~/Projects/detention"
graphPath <- paste(gitRoot, "app/graphs", sep="/")

loadNationalityData <- function (){  
  processedCSV <- paste(gitRoot, "data/nationalities-geo.csv", sep="/")
  p <- read.csv(processedCSV)
  
  # Clean the data
  p$Date <- as.Date(p$Date)
  p$Male[is.na(p$Male)] <- 0 
  p$Female[is.na(p$Female)] <- 0 
  p$Child.Male[is.na(p$Child.Male)] <- 0 
  p$Child.Female[is.na(p$Child.Female)] <- 0 
  
  # Sum the populations
  p$Total.Adults <- p$Male + p$Female
  p$Total.Children <- p$Child.Male + p$Child.Female
  p$Total.People <- p$Total.Adults + p$Total.Children
  
  return (p)
}

renderNationalityChart <- function (nationalities){
  plt <- ggplot(
      nationalities,
      aes(x=Date, y=Total.People, colour=Nationality)
    ) + 
    geom_line() + 
    ggtitle('Overall population by nationality') + 
    ylab('Population')
  imageFile <- paste('total-population-by-nationality.png', sep = "")
  #ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
  return (plt)
}

n <- loadNationalityData()

# TODO: find the max for each country
nations <- c()
nations$list <- unique(n$Nationality)
nations$max <- c()
#for (i in 1:length(nations$list)) { 
#  print(nations$max[[i]]) 
#}
# TODO: filter out the lowest ones


plt <- renderNationalityChart(n)