// This captures the click on the icon in the toolbar
browser.browserAction.onClicked.addListener(function(tab) {
    // We want to check if an Athlete Number has been provided,
    // if so lets display their results page
    browser.storage.local.get({
      athlete_number: '',
      home_parkrun_info: {}
    }).then((items) => {
        // console.log('Icon clicked, loading based on '+JSON.stringify(items))
        // If no athlete number has been set, load the options page
        if (items.athlete_number == '') {
            browser.runtime.openOptionsPage();
        } else {
            var results_url = "http://www.parkrun.org.uk/results/athleteeventresultshistory/?athleteNumber="+items.athlete_number+"&eventNumber=0"
            // Don't redirect Malaysian users as their website doesn't work
            if ("local_url" in items.home_parkrun_info && items.home_parkrun_info.local_url.indexOf('parkrun.my') === -1) {
              var local_url = items.home_parkrun_info.local_url
              results_url = local_url+"/"+get_localised_value("url_athleteeventresultshistory", local_url)+"?athleteNumber="+items.athlete_number+"&eventNumber=0"
            }
            browser.tabs.create({ url: results_url });
        }

    });

});

// The data will be updated when there is no data, or it is over the
// configured age

var cache = {
    'geo': {
        'raw_data': undefined,
        'updated_at': undefined,
        'last_update_attempt': undefined,
        'updating': false,
        'max_age': 3 * 24 * 60 * 60 * 1000,
        'url': "https://www.parkrun.org.uk/wp-content/themes/parkrun/xml/geo.xml",
        'datatype': 'xml',
        'enabled': true,
        'timeout': 5000
    },
    'technical_event_information': {
        'raw_data': undefined,
        'updated_at': undefined,
        'last_update_attempt': undefined,
        'updating': false,
        'max_age': 3 * 24 * 60 * 60 * 1000,
        'url': "https://wiki.parkrun.com/index.php/Technical_Event_Information",
        'datatype': 'html',
        'enabled': true,
        'timeout': 5000
    },
    'data': undefined,
    'updated_at': undefined
}

function get_cache_summary() {

  var summary = {
    'regions': '<missing>',
    'events': '<missing>',
    'countries': '<missing>',
    'event_status': '<missing>',
    'data': {
      'geo': {
        'updated_at': cache.geo.updated_at
      },
      'technical_event_information': {
        'updated_at': cache.technical_event_information.updated_at
      }
    }
  }

  if (cache.data !== undefined) {

    if ('regions' in cache.data) {
      summary.regions = Object.keys(cache.data.regions).length
    }
    if ('events' in cache.data) {
      summary.events = Object.keys(cache.data.events).length
    }
    if ('countries' in cache.data) {
      summary.countries = Object.keys(cache.data.countries).length
    }
    if ('event_status' in cache.data) {
      if (cache.data.event_status !== undefined) {
        summary.event_status = Object.keys(cache.data.event_status).length
      }
    }

  }

  return summary

}

function clear_cache() {
  clear_cache_by_name("geo")
  clear_cache_by_name("technical_event_information")
}

function clear_cache_by_name(name) {
  if (name in cache) {
    cache[name].raw_data = undefined
    cache[name].updated_at = undefined
    cache[name].last_update_attempt = undefined
    regenerate_cache_data()
  }
}

function traverse_geo_data(geo_data, region_name, depth=0) {

    // console.log('traverse_geo_data('+region_name+')')

    var regions = geo_data.regions
    var events = geo_data.events

    $.each(regions[region_name].child_region_names, function(index, child_region_name) {
        traverse_geo_data(geo_data, child_region_name)
    })

    // REGIONS
    // Add all of our child region names and ids to the recursive list first
    $.each(regions[region_name].child_region_names, function(index, child_region_name) {
        regions[region_name].child_region_recursive_names.push(child_region_name)
        regions[region_name].child_region_recursive_ids.push(regions[child_region_name].id)
    })
    // Now add all the ones from each of our children
    $.each(regions[region_name].child_region_names, function(index, child_region_name) {
        $.each(regions[child_region_name].child_region_recursive_names, function(index, rec_child_region_name) {
            regions[region_name].child_region_recursive_names.push(rec_child_region_name)
            regions[region_name].child_region_recursive_ids.push(regions[rec_child_region_name].id)
        })
    })

    // EVENTS
    // Add all of our child event names and ids to the recursive list first
    $.each(regions[region_name].child_event_names, function(index, child_event_name) {
        regions[region_name].child_event_recursive_names.push(child_event_name)
        regions[region_name].child_event_recursive_ids.push(events[child_event_name].id)
    })
    // Now add all the ones from each of our children
    $.each(regions[region_name].child_region_names, function(index, child_region_name) {
        $.each(regions[child_region_name].child_event_recursive_names, function(index, rec_child_event_name) {
            regions[region_name].child_event_recursive_names.push(rec_child_event_name)
            regions[region_name].child_event_recursive_ids.push(events[rec_child_event_name].id)
        })
    })

}

function parse_geo_data_regions(geo_data, geo_xml) {

    // console.log('parse_geo_data_regions()')
    // console.log(geo_xml)

    if (geo_data === undefined) {
      return
    }
    if (geo_xml === undefined) {
      return
    }

    // Find all the regions
    $(geo_xml).find('r').each(function(region_index) {
        this_region = $(this)
        geo_data.regions[this_region.attr('n')] = {
            // All the standard attributes that come from the parkrun data
            "id": this_region.attr('id'),
            "name": this_region.attr('n'),
            "lat": this_region.attr('la'),
            "lon": this_region.attr('lo'),
            "zoom": this_region.attr('z'),
            "parent_id": this_region.attr('pid'),
            "url": this_region.attr('u'),

            // Extra attributes that we are going to fill in
            // Direct children regions and events
            "child_region_ids": [],
            "child_region_names": [],
            "child_event_ids": [],
            "child_event_names": [],
            // Children of children etc...
            "child_region_recursive_ids": [],
            "child_region_recursive_names": [],
            "child_event_recursive_ids": [],
            "child_event_recursive_names": []
        }
    })

    // We may wish to move some countries to a top level
    // If so, we can do that here
    // var moved_top_level_regions = ['Namibia', 'Swaziland']
    // $.each(moved_top_level_regions, function(index, region) {
    //     if (region in geo_data.regions) {
    //         if (geo_data.regions[region].parent_id != "1") {
    //             geo_data.regions[region].parent_id = "1"
    //         }
    //     }
    // })

    return
}

function parse_geo_data_events(geo_data, geo_xml) {

  if (geo_data === undefined) {
    return
  }
  if (geo_xml === undefined) {
    return
  }

    // Find all the events
    $(geo_xml).find('e').each(function(region_index) {
        this_event = $(this)
        geo_data.events[this_event.attr('m')] = {
            // All the standard attributes that come from the parkrun data
            "shortname": this_event.attr('n'),
            "name": this_event.attr('m'),
            "region_id": this_event.attr('r'),
            "country_id": this_event.attr('c'),
            "id": this_event.attr('id'),
            "lat": this_event.attr('la'),
            "lon": this_event.attr('lo'),
            // Extra attributes that we are going to fill in
            "region_name": "unknown",
            "country_name": "unknown"
        }
    })

    return

}

function compute_geo_data_heirachy(data) {

  if (data === undefined) {
    return
  }

    // Create maps between ids and names
    region_id_to_name_map = {}
    region_name_to_id_map = {}
    $.each(data.regions, function(region_name, region_info) {
        region_id_to_name_map[region_info.id] = region_name
        region_name_to_id_map[region_name] = region_info.id
    })

    // Add region as a child to its parent
    $.each(data.regions, function(region_name, region_info) {
        if (region_info.parent_id !== null && region_info.parent_id != "") {
            if (region_info.parent_id in region_id_to_name_map) {
                parent_region_name = region_id_to_name_map[region_info.parent_id]
                data.regions[parent_region_name].child_region_ids.push(region_info.id)
                data.regions[parent_region_name].child_region_names.push(region_info.name)
            }
        }
    })


    // Find all the countries in the regions we have parsed
    $.each(data.regions, function(region_name, region_info) {
        // If the country's parent id is 1, that means it is directly
        // listed under "World"
        if (region_info.parent_id == "1") {
            data.countries[region_name] = {
                "name": region_name,
                "region_name": region_name,
                "region_id": region_info.id
            }
        }
    })

    // Add each event to a region
    $.each(data.events, function(event_name, event_info) {
        if (event_info.region_id in region_id_to_name_map) {
            // Add the event under the region to which it belongs...
            // ... but only if it is a live event
            if (event_info.status === 'unknown' || event_info.status == 'Live') {
                var event_region_name = region_id_to_name_map[event_info.region_id]
                event_info.region_name = event_region_name
                data.regions[event_region_name].child_event_ids.push(event_info.id)
                data.regions[event_region_name].child_event_names.push(event_info.name)
           } else {
               // console.log("Skipping "+event_info.name+" as it is in state "+event_info.status)
           }
        } else {
            // console.log("Unknown region '"+event_info.region_id+"' for "+event_info.name)
        }
    })

    // Traverse the tree of regions from World down, and sum up all
    // the events and ids, but only if it exists in the data we have
    if ("World" in data.regions) {
      traverse_geo_data(data, "World")
    }

    // Iterate though each country and set an event's country
    $.each(data.countries, function(index, country_info) {
        $.each(data.regions[country_info.name].child_event_recursive_names, function(index, event_name) {
            data.events[event_name].country_name = country_info.name
            // console.log(data.regions[country_info.name].url)
            data.events[event_name].local_url = data.regions[country_info.name].url
        })
    })

    return data
}

function parse_tee_data_event_status(data, result) {

  if (result === undefined) {
    return
  }

  // Reset the event status data to a blank map
  data.event_status = {}

  var ownerDocument = document.implementation.createHTMLDocument('virtual');
  // Load the results into a virtual document, so that it doesn't attempt to load
  // inline scripts etc...
  // Solution taken from https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
  // referencing https://api.jquery.com/jQuery/ & https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
  $(result, ownerDocument).find('div[id=mw-content-text]>table:first').each(function(table_index) {
     var content_table = $(this)

     content_table.find('tbody>tr').each(function(row_index) {
         var content_table_row_cell = $('td', this)
         if (content_table_row_cell[0] !== undefined) {
             var parkrun_info = {
                 parkrun_name: content_table_row_cell[0].innerText.trim(),
                 parkrun_event_director: content_table_row_cell[1].innerText.trim(),
                 parkrun_event_number: content_table_row_cell[2].innerText.trim(),
                 parkrun_status: content_table_row_cell[3].innerText.trim(),
                 parkrun_country: content_table_row_cell[4].innerText.trim(),
                 parkrun_portal_number: content_table_row_cell[5].innerText.trim()
             }
             data.event_status[parkrun_info.parkrun_event_number] = parkrun_info
             // console.log(parkrun_info)
         }
     })
  })

 return

}

function compute_event_status(data) {

  if (data === undefined) {
    return
  }

  // Loop through the existing geo_data, and supplement it with the
  // extra event data we have found if there is a match
  $.each(data.events, function(event_name, event_info) {
     if (data.event_status !== undefined && event_info.id in data.event_status) {
         // console.log('Found state '+live_parkrun_event_data[event_info.id].parkrun_status+" for "+event_name)
         data.events[event_name].status = data.event_status[event_info.id].parkrun_status
     } else {
         data.events[event_name].status = 'unknown'
     }
  })

  return

}

function get_geo_data(notify_func, freshen=false) {
    var now = new Date()

    // Work out if any of the files in 'cache' need updating
    // and construct a parallel ajax call to fetch whichever ones we need
    // this allows for easy extension in the future by adding data sources
    // with not a lot of code changes
    var data_sources = ['geo', 'technical_event_information']
    var ajax_calls = []
    // Make a not if any deferred ajax calls are created
    var update_needed = false
    $.each(data_sources, function (index, page) {
        // console.log('.ajax - '+page+' - freshen='+freshen)
        // Check if see if the data is:
        // not yet available (1), or never updated (2), or expired (3), or we want a fresh copy (4)
        if (cache[page].enabled && (
            cache[page].raw_data === undefined || // 1
            cache[page].updated_at === undefined || // 2
            cache[page].updated_at < (now - cache[page].max_age) || // 3
            freshen // 4
            )
        ) {
            update_needed = true
            // console.log('.ajax - '+page+' update needed')
            // Add the call to the list with the configured parameters
            // This will return the entire page
            ajax_calls.push($.Deferred(function (defer) {
                $.ajax({
                     url: cache[page].url,
                     dataType: cache[page].datatype,
                     timeout: cache[page].timeout,
                     success: function (result) {
                         // console.log('Fresh fetch of '+cache[page].url)
                         cache[page].raw_data = result
                         cache[page].updated_at = new Date()
                         defer.resolve(result)
                     },
                     error: function (xhr, status, error) {
                         // console.log("Error fetching "+cache[page].url+": "+error+" - "+status)
                         defer.resolve(undefined)
                     }
                 })
            }))
        } else {
            // Add a call that only returns the previously returned data
            // This means we can do the same things in the when function
            // console.log('.ajax - '+page+' posting cached request response, expires in '+
            //     Math.round((cache[page].max_age - (now - cache[page].updated_at))/1000)+'s')
            ajax_calls.push($.Deferred(function (defer) {
                defer.resolve(cache[page].raw_data)
            }))
        }
    })

    if (update_needed) {
        // console.log('Updated required, executing deferred AJAX requests')
        $.when( ajax_calls[0], ajax_calls[1] ).done(
            function ( data_geo, data_tee ) {

                // We absolutely need the geo data, without which we can't do
                // anything.
                if (data_geo === undefined) {
                    // See if we have a previous one to fall back on
                    if (cache.geo.raw_data === undefined) {
                        // If not, send something back
                        console.log('Brakuje danych!')
                        notify_geo_data(notify_func)
                        return
                    } else {
                        // Else make the best use of what we had previously
                        console.log('Próbujemy z poprzednimi surowymi danymi.')
                        data_geo = cache['geo'].raw_data
                    }
                } else {
                  console.log('Świeże dane dostępne.')
                }

                // Check if we have technical event information and fall back if not
                if (data_tee === undefined) {
                    data_tee = cache.technical_event_information.raw_data
                }

                update_cache_data(data_geo, data_tee)

                notify_geo_data(notify_func)
                return
            }
        )
    } else {
        // Just return the cached data
        console.log('Zwracamy scachowane dane TEE i Geo.')
        notify_geo_data(notify_func)
    }

}

function regenerate_cache_data() {
  update_cache_data(cache.geo.raw_data, cache.technical_event_information.raw_data)
}

function update_cache_data(data_geo, data_tee) {

  if (data_geo === undefined) {
    cache.data = undefined
    cache.updated_at = undefined
    return cache.data
  }

  // Build up our new data
  var data = {
    'regions': {},
    'events': {},
    'countries': {},
    'event_status': undefined
  }

  // First of all lets go and parse all the regions and all of
  // the events in the XML file and put them in out data structure.
  // Any additional parsing or additions to this data will be
  // done afterwards
  parse_geo_data_regions(data, data_geo)
  parse_geo_data_events(data, data_geo)

  // If the technical event information has been obtained, then
  // lets parse that.
  // if (data_tee !== null) {
  parse_tee_data_event_status(data, data_tee)
  // }

  // This could potentially do nothing if no event info is available
  compute_event_status(data)
  // console.log(data)
  // Create the heirachy of events by region
  compute_geo_data_heirachy(data)

  // Update the global cache
  cache.data = data
  cache.updated_at = new Date()

  return data

}

function notify_geo_data(f) {
    if (f !== undefined) {
        if (cache.data !== undefined) {
            // console.log('Notifying caller with cached data ('+JSON.stringify(cache.data).length+' bytes), last updated at ' + cache.updated_at)
            f({
                'data': cache.data,
                'updated': cache.updated_at.toString()
            })
        } else {
            f({
                'data': null,
                'updated': 'never'
            })
        }
    }
}

  browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // console.log(sender.tab ?
      //             "from a content script:" + sender.tab.url :
      //             "from the extension");
      if (request.data == "geo") {
          // sendResponse({farewell: 'argh'});
          var freshen = false
          if ('freshen' in request) {
              if (request.freshen === true) {
                  freshen = true
              }
          }
          // console.log('freshen='+freshen)
        get_geo_data(function(geo_data) {
            // console.log('Sending response back to the page')
            returned_data = {"geo": geo_data}
            // console.log(returned_data)
            sendResponse(returned_data);
        }, freshen);

        // Indicate we are going to return a response asynchronously
        // https://developer.chrome.com/extensions/runtime#event-onMessage
        return true
      }
      if (request.action) {
        var done = false
        var msg = request.action + ": OK"
        switch(request.action) {
          case "cache-all-clear":
            clear_cache()
            done = true
            break
          case "cache-geo-clear":
            clear_cache_by_name("geo")
            done = true
            break
          case "cache-tei-clear":
            clear_cache_by_name("technical_event_information")
            done = true
            break
          case "cache-get":
            if (cache.data) {
              msg = JSON.stringify(cache.data,null,2)
            } else {
              msg = "<no cached data>"
            }
            done = true
            break
          case "cache-get-summary":
            var cache_summary = get_cache_summary()
            msg = JSON.stringify(cache_summary,null,2)
            done = true
            break
          case "enable-geo":
            cache.geo.enabled = true
            done = true
            break
          case "disable-geo":
            cache.geo.enabled = false
            done = true
            break
          case "enable-tei":
            cache.technical_event_information.enabled = true
            done = true
            break
          case "disable-tei":
            cache.technical_event_information.enabled = false
            done = true
            break
        }
        if (done) {
          sendResponse({
            "action": request.action,
            "msg": msg
          });
        } else {
          sendResponse({
            "action": request.action,
            "msg": request.action + ": Unsupported action"
          });
        }
      }
    });
