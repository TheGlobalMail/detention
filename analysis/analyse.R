library(ggplot2)
library(plyr)
library(lubridate)

# Files
gitRoot <- "~/git/detention"
graphPath <- paste(gitRoot, "app/graphs", sep="/")

loadIncidentData <- function (){
  processedCSV <- paste(gitRoot, "data/processed.csv", sep="/")
  p <- read.csv(processedCSV)
  p$occurred_on <- as.Date(p$occurred_on, format='%Y-%m-%d')
  p$week <- floor_date(p$occurred_on, "week")
  p <- p[!is.na(p$location),]
  p <- p[p$location != "",]
  return (p)
}

loadPopulationData <- function(){
  summariesCompiledLocationsCSV <- paste(gitRoot, "data/summaries-compiled-locations.csv", sep="/")
  pop <- read.csv(summariesCompiledLocationsCSV)
  pop$date <- as.Date(pop$date, format='%Y-%m-%d')
  pop$week <- floor_date(pop$date, "week")
  pop$men[is.na(pop$men)] <- 0 
  pop$women[is.na(pop$women)] <- 0 
  pop$children[is.na(pop$children)] <- 0 
  pop$ourlocation <- gsub("(^ +)|( +$)", "", tolower(pop$ourlocation))
  pop$total <- pop$men + pop$women + pop$children
  return (pop)
}

incidentCategoriesVsPopulation <- function(inc, pop){
  gInc <- ggplot(inc, aes(week, fill=incident_category, group=incident_category)) +
    geom_area(stat='bin') +
    ggtitle('Overall') +
    ylab('Event per week') +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
  print(gInc)
  imageFile <- paste('overall-incident-categories.png', sep = "")
  ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)

  overallPop <- ddply(pop,~date,summarise,overall_total=sum(total))
  gPop <- ggplot(overallPop, aes(date, overall_total)) +
    geom_line() +
    ggtitle('Overall') +
    ylab('Population') +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
  print(gPop)
  imageFile <- paste('overall-population.png', sep = "")
  ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
}

incidentCategoriesVsPopulationForIdc <- function(inc, pop){
  idc <- p[p$facility_type == 'idc',]
  locations <- unique(idc$location)
  for (location in locations) {
    d <- inc[p$location == location,]
    gLoc <- ggplot(d, aes(week, fill=incident_category, group=incident_category)) +
      geom_area(stat='bin') +
      ggtitle(location) +
      ylab('Event per week') +
      #xlim(min(pop$date, na.rm = TRUE), max(pop$date, na.rm = TRUE))
      xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
    print(gLoc)
    imageFile <- paste(gsub(" ", "-", location), '-incident-categories.png', sep = "")
    ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)

    locPop <- pop[pop$ourlocation == location,]
    if (dim(locPop)[1] == 0){
      print(paste('Could not find matching locations in population data for ', location, sep = ''))
    }else{
      gLocPop <- ggplot(locPop, aes(date, total)) +
        geom_line() +
        ggtitle(location) +
        ylab('Population') +
        #xlim(min(pop$date, na.rm = TRUE), max(pop$date, na.rm = TRUE)) 
        xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
      print(gLocPop)
      imageFile <- paste(gsub(" ", "-", location), '-population.png', sep = "")
      ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
    }
  }
}

# Import incident and population data
incidents <- loadIncidentData()
population <- loadPopulationData()

# Generate analysis graphs
incidentCategoriesVsPopulation(incidents, population)
incidentCategoriesVsPopulationForIdc(incidents, population)
