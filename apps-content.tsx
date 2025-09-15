        apps: () => (
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps to connect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-muted"
                    onClick={() => setSearchQuery("")}
                    title="Clear Search"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 mt-3 max-h-60 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <div className="space-y-2">
                {/* Available Apps */}
                {!searchQuery && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {apps.map((app) => {
                        const isConnected = connectedPlatforms.includes(app.id);
                        const isLoading = loading[app.id];
                        
                        return (
                          <Card
                            key={app.id}
                            className={`p-3 transition-colors border-border/50 ${
                              isConnected 
                                ? "bg-green-50/50 border-green-200/50" 
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 ${app.bg} rounded-lg flex items-center justify-center`}
                                >
                                  {app.icon}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-foreground">
                                    {app.name}
                                  </span>
                                  <p className={`text-xs ${
                                    isConnected ? "text-green-600" : "text-muted-foreground"
                                  }`}>
                                    {isConnected ? "Connected" : "Not connected"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isConnected ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePlatformDisconnect(app.id)}
                                    disabled={isLoading}
                                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    {isLoading ? "Disconnecting..." : "Disconnect"}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handlePlatformConnect(app.id)}
                                    disabled={isLoading}
                                    className="h-8 px-3"
                                  >
                                    {isLoading ? "Connecting..." : "Connect"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
