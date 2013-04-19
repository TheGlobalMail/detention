library(ggplot2)
library(plyr)
library(lubridate)

# Files
gitRoot <- "~/git/detention"
processedCSV <- paste(gitRoot, "data/processed.csv", sep="/")
graphPath <- paste(gitRoot, "app/graphs", sep="/")
summariesCompiledLocationsCSV <- paste(gitRoot, "data/summaries-compiled-locations.csv", sep="/")


p <- read.csv(processedCSV)

p$occurred_on <- as.Date(p$occurred_on, format='%Y-%m-%d')
p$week <- floor_date(p$occurred_on, "week")

p <- p[!is.na(p$location),]
p <- p[p$location != "",]
facility_types <- unique(p$facility_type)

pop <- read.csv(summariesCompiledLocationsCSV)
#pop$week <- floor_date(as.Date(pop$date), "week")
pop$date <- as.Date(pop$date, format='%Y-%m-%d')
pop$men[is.na(pop$men)] <- 0 
pop$women[is.na(pop$women)] <- 0 
pop$children[is.na(pop$children)] <- 0 
pop$ourlocation <- gsub("(^ +)|( +$)", "", tolower(pop$ourlocation))
pop$total <- pop$men + pop$women + pop$children

# overall facility narrative
idc <- p[p$facility_type == 'idc',]
locations <- unique(idc$location)
for (location in locations) {
  print(location)
  d <- p[p$location == location,]
  c <- ggplot(d, aes(week, fill=incident_category, group=incident_category)) +
    geom_area(stat='bin') +
    ggtitle(location) +
    ylab('Event per week') +
    #xlim(min(pop$date, na.rm = TRUE), max(pop$date, na.rm = TRUE))
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
  print(c)
  imageFile <- paste(gsub(" ", "-", location), '-incident-categories.png', sep = "")
  ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
  locPop <- pop[pop$ourlocation == location,]

  if (dim(locPop)[1] == 0){
    print('empty data!')
  }else{
    c2 <- ggplot(locPop, aes(date, total)) +
      geom_line() +
      ggtitle(location) +
      ylab('Population') +
      #xlim(min(pop$date, na.rm = TRUE), max(pop$date, na.rm = TRUE)) 
      xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE))
    print(c2)
    imageFile <- paste(gsub(" ", "-", location), '-population.png', sep = "")
    ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)
  }
}

# facet by facility type
for (facility_type in facility_types) {
  ft = p[p$facility_type == facility_type,]
  ft <- ft[ft$incident_category != 'other',]
  ft <- ft[ft$incident_category != 'media and protest',]
  c <- ggplot(ft, aes(week, colour=incident_category, group=incident_category)) +
    geom_freqpoly() +
    ggtitle(facility_type) +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE)) +
    facet_wrap(~location, scales="free_y") 
  #print(c)
}


# onshore/offshore vs by week
c <- ggplot(p, aes(week, fill=offshore)) +
  geom_bar(position='dodge') +
  theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
  facet_wrap(~incident_type, scales="free_y") 
#print(c)

# facility_type vs by week
c <- ggplot(p, aes(incident_type))+
  geom_bar() +
  facet_grid(facility_type~.)+
  theme_bw()+
  theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
  scale_fill_brewer()
#print(c)

c <- ggplot(p, aes(incident_category))+
 geom_bar() +
 facet_grid(facility_type~., scales="free_y")+
 theme_bw()+
  theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
 scale_fill_brewer()
#print(c)

for (facility_type in facility_types) {
  #print(facility_type)
  d <- p[p$facility_type == facility_type,]
  c <- ggplot(d, aes(week)) +
    ggtitle(facility_type) +
    xlim(min(d$week, na.rm = TRUE), max(d$week, na.rm = TRUE)) +
    geom_bar() + facet_wrap(~incident_type)
  #print(c)
}

locations <- unique(p$location)
for (location in locations) {
  #print(location)
  d <- p[p$location == location,]
  c <- ggplot(d, aes(week)) +
    ggtitle(location) +
    xlim(min(p$week, na.rm = TRUE), max(p$week, na.rm = TRUE)) +
    geom_bar() + facet_wrap(~incident_type)
  #print(c)
}

#c <- ggplot(p, aes(week)) +
#  geom_bar() + facet_wrap(facility_type~incident_type, scales="free_y") 
#print(c)
# each facility


# offshore/onshore
#c <- ggplot(p, aes(incident_type, fill=offshore)) + geom_bar() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
#print(c)
#c <- ggplot(p, aes(incident_category, fill=offshore)) + geom_bar() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
#print(c)

locations <- unique(p$location)

#c <- ggplot(p, aes(week)) +
#  geom_bar() + facet_wrap(offshore~incident_type, scales="free_y") 


#c <- ggplot(p, aes(week)) +
#  geom_bar() + facet_wrap(location~incident_type, scales="free_y", ncol=17) 
#print(c)

#c <- ggplot(p, aes(week)) +
#  geom_bar() + facet_wrap(location~incident_category, scales="free_y") 
#print(c)

# incident types over time 
#c <- ggplot(p, aes(occurred_on)) + geom_bar() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
#print(c)

#c <- qplot(occurred_on, data = p, geom = "line", color = incident_type)
#p$occurred_on <- as.Date(p$occurred_on)
#qplot(incident_type, data = p, geom = "bar", ylab = "#")
#ggplot(p, aes(x=incident_type)) +
#  geom_bar()

#ggplot(data=p)+
# geom_bar(mapping=aes(x=incident_type))+
# facet_grid(location~.)+
# theme_bw()+
# scale_fill_brewer()

