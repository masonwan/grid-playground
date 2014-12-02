declare var $:any;

class MenuController {
    $menuContainer;
    $containerParent;

    initlize() {
        var $container = this.$menuContainer = $('.menu-container');
        var $parent = this.$containerParent = $container.parent();
        var isClickTrigger = (location.hash.indexOf('useHover') < 0);

        if (isClickTrigger) {
            bindMenuClick();
            bindContainerClick();

            function bindMenuClick() {
                $container
                    .on('click', function (event) {
                        showMenu();
                        event.stopPropagation();
                    });
            }

            function bindContainerClick() {
                $parent
                    .on('click', function () {
                        hideMenu();
                    });
            }
        } else {
            $container
                .on('mouseenter', function () {
                    showMenu();
                })
                .on('mouseleave', function () {
                    hideMenu();
                });
        }

        function showMenu() {
            console.log('Showing menu');
            $container
                .stop();
            var left = $container.position().left;
            $container
                .animate({
                    left: 0
                }, 100);
        }

        function hideMenu() {
            console.log('Hiding menu');
            $container
                .stop();
            var left = $container.position().left;
            $container
                .animate({
                    left: -230
                }, 100);
        }
    }
}
