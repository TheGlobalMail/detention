library(ggplot2)
library(plyr)
library(lubridate)

# Files
gitRoot <- "~/Projects/detention"
graphPath <- paste(gitRoot, "app/graphs", sep="/")

loadNationalityData <- function (){
# @returns:
#
#        long       lat Nationality Code       Date Female Male Child.Female Child.Male Male.Child Female.Child
#  1 80.77180  7.873054   Sri Lanka   LK 2013-01-31    186 2168          112        197         NA           NA
#  2 53.68805 32.427908        Iran   IR 2013-01-31    172  355           91        106         NA           NA
#  3 67.70995 33.939110 Afghanistan   AF 2013-01-31     29  445           25        135         NA           NA
#  4 43.67929 33.223191        Iraq   IQ 2013-01-31     38  112           39         41         NA           NA
#  5 90.35633 23.684994  Bangladesh   BD 2013-01-31     NA  195           NA          2         NA           NA
#  6 69.34512 30.375321    Pakistan   PK 2013-01-31      9  132            5         25         NA           NA
#    Total.Adults Total.Children Total.People
#  1         2354            309         2663
#  2          527            197          724
#  3          474            160          634
#  4          150             80          230
#  5           NA             NA           NA
#  6          141             30          171
  
  processedCSV <- paste(gitRoot, "data/nationalities-geo.csv", sep="/")
  p <- read.csv(processedCSV)
  # Clean the data
  p$Date <- as.Date(p$Date)
  p$Male[is.na(p$Male)] <- 0 
  p$Female[is.na(p$Male)] <- 0 
  p$Male.Child[is.na(p$Male)] <- 0 
  p$Female.Child[is.na(p$Male)] <- 0 
  # Sum the populations
  p$Total.Adults <- p$Male + p$Female
  p$Total.Children <- p$Child.Male + p$Child.Female
  p$Total.People <- p$Total.Adults + p$Total.Children
  #print(head(p))
  return (p)
}

nationalities <- loadNationalityData()

plt = ggplot(
    nationalities,
    aes(x=Date, y=Total.People, colour=Nationality)
  ) +
  geom_line() +
  ggtitle('Overall population by nationality') +
  ylab('Population')
print(plt)
imageFile <- paste('total-population-by-nationality.png', sep = "")
ggsave(imageFile, width=14, height=6, dpi=100, path=graphPath)