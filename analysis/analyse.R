library(ggplot2)
library(plyr)
library(lubridate)
require(reshape)

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
  summariesCompiledLocationsCSV <- paste(gitRoot, "data/summaries-compiled-locations-FINAL.csv", sep="/")
  pop <- read.csv(summariesCompiledLocationsCSV)
  pop$date <- as.Date(pop$date)
  pop$week <- floor_date(pop$date, "week")
  pop$men[is.na(pop$men)] <- 0 
  pop$men = as.numeric(pop$men)
  pop$women[is.na(pop$women)] <- 0 
  pop$women = as.numeric(pop$women)
  pop$children[is.na(pop$children)] <- 0 
  pop$children = as.numeric(pop$children)
  pop$ourlocation <- gsub("(^ +)|( +$)", "", tolower(pop$ourlocation))
  pop$total <- pop$men + pop$women + pop$children
  return (pop)
}

incidentCategoriesVsPopulation <- function(inc, pop){
  gInc <- ggplot(inc, aes(week, fill=incident_category, group=incident_category)) +
    geom_area(stat='bin', binwidth = 7) +
    ggtitle('Overall') +
    ylab('Event per week') +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
  print(gInc)
  imageFile <- paste('overall-incident-categories.png', sep = "")
  ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)

  overallIncidentsPerWeek <- ddply(inc,~week,summarise, freq=length(week))
  overallPop <- ddply(pop,~date,summarise, men=sum(men), women=sum(women), children=sum(children))
  overallPopMelt <- melt(overallPop, id="date")
  gPop <- ggplot(overallPopMelt, aes(date, value, fill=variable)) +
    geom_area() +
    ggtitle('Overall') +
    ylab('Population') +
    scale_fill_brewer(palette="Spectral") +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
  print(gPop)
  imageFile <- paste('overall-population.png', sep = "")
  ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
}

incidentCategoriesVsPopulationForIdc <- function(inc, pop){
  idc <- inc[inc$facility_type == 'idc',]
  locations <- unique(idc$location)
  for (location in locations) {
    print(location)
    d <- inc[p$location == location,]
    gLoc <- ggplot(d, aes(week, fill=incident_category, group=incident_category)) +
      geom_area(stat='bin', binwidth=7) +
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
      summed <- ddply(locPop,~date,summarise, men=sum(men), women=sum(women), children=sum(children))
      locPopMelt <- melt(summed, id="date")
      gPop <- ggplot(locPopMelt, aes(date, value, fill=variable)) +
        geom_area() +
        ggtitle(location) +
        ylab('Population') +
        scale_fill_brewer(palette="Spectral") +
        xlim(min(inc$week, na.rm = TRUE), max(inc$week, na.rm = TRUE))
      print(gPop)
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
